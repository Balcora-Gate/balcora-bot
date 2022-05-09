import fetch from 'node-fetch';
import { URLSearchParams, URL } from 'url';

import logger from './logger';
import ModelType from './models/model_types';
import { WepnSummary, calcShotsPerSecond, parseUsedByWepn, WepnUsedBy, WepnTarget, WepnEffect, WepnEffectType, WepnType } from './models/wepn';
import { ArmourType, ShipClass, ShipSummary } from './models/ship';
import { parseUsedBySubs, SubsSummary, SubsUsedBy } from './models/subs';

import * as Glot from './glot-io';
import { prettyPrintObj } from './formatting';
import { InfoFlags } from './commands/info';

const cleanVal = (val: string | number | boolean | undefined) => {
	if (typeof val === `string`) {
		// double/single quotes
		const pattern = /["']/gm;
		if (pattern.test(val)) {
			const cleanStr = val.replace(pattern, ``);
			if (cleanStr.length === 0) {
				return `<none>`;
			}
			return cleanStr;
		}
		// potential numbers
		const cleanNum = parseFloat(val);
		if (!isNaN(cleanNum)) {
			return cleanNum;
		}
	} else if (typeof val === `undefined`) {
		return `<none>`;
	}
	return val;
};

type MiscData = { [key: string]: unknown };
export interface APIData {
	_id: string,
	name: string,
	category: string
}

export interface APIWepnData extends APIData {
	result: MiscData,
	config: MiscData,
	used_by: WepnUsedBy,
	penetration: { [key: string]: number } & {
		default_damage_mult: number
	},
	accuracy: { [key: string]: number } & {
		default_acc_mult: number
	}
}
const summarizeWepnData = (data: APIWepnData): WepnSummary => {
	const wepn_summary: Record<keyof WepnSummary, WepnSummary[keyof WepnSummary]> = {
		'Name': data.name,
		'Effect': data.result.effect as WepnEffect,
		'Target': data.result.target as WepnTarget,
		'Effect Type': data.config.fire_type as WepnEffectType,
		'Range': data.config.fire_range as number,
		'Min Effect': data.result.min_effect_val as number,
		'Max Effect': data.result.max_effect_val as number,
		'Weapon Type': data.config.type as WepnType,
		'Projectile Speed': data.config.projectile_speed as number,
		'Shots/s': calcShotsPerSecond(data.config) as number,
		'Spawn Effect': data.result.spawned_weapon_effect as string,
		'Used by Ships': parseUsedByWepn(data.used_by.ship),
		'Used by Subs': parseUsedByWepn(data.used_by.subs),
	};
	for (const [k, v] of Object.entries(wepn_summary)) {
		wepn_summary[k as keyof typeof wepn_summary] = cleanVal(v) as (string | number);
	}
	return wepn_summary as WepnSummary;
};

export interface APIShipData extends APIData {
	attribs: MiscData & {
		ArmourFamily: string,
		AttackFamily: string
	},
	abilites: { [key: string]: string },
	emp: {
		HP: number,
		regen_time: number
	}
}
const summarizeShipData = (data: APIShipData): ShipSummary => {
	const pretty_ship: Record<keyof ShipSummary, ShipSummary[keyof ShipSummary]> = {
		'Name': data.name,
		'Class': data.attribs.DisplayFamily as ShipClass,
		'Hitpoints': data.attribs.maxhealth as number,
		'Build Cost': data.attribs.buildCost as number,
		'Build Time': data.attribs.buildTime as number,
		'Max Forward Speed': data.attribs.mainEngineMaxSpeed as number,
		'Max Strafe Speed': data.attribs.thrusterMaxSpeed as number,
		'Armour Type': data.attribs.ArmourFamily as ArmourType
	};
	for (const [k, v] of Object.entries(pretty_ship)) {
		pretty_ship[k as keyof typeof pretty_ship] = cleanVal(v) as (string | number);
	}
	return pretty_ship as ShipSummary;
};

export interface APISubsData extends APIData {
	attribs: MiscData,
	weapon: null | unknown,
	used_by: SubsUsedBy
}
const summarizeSubsData = (data: APISubsData): SubsSummary => {
	const subs_summary: Record<keyof SubsSummary, SubsSummary[keyof SubsSummary]> = {
		'Name': data.name,
		'Type': data.weapon === null ? `System` : `Weapon`,
		'Hitpoints': data.attribs.maxhealth as number,
		'Regen Time': data.attribs.regentime as number,
		'Build Cost': data.attribs.costToBuild as number,
		'Build Time': data.attribs.timeToBuild as number,
		'Innate': (data.attribs.innate || false) as boolean,
		'Visible': (data.attribs.visible || false) as boolean,
		'Linked Weapon': data.weapon as string,
		'Used by Ships': parseUsedBySubs(data.used_by.ship)
	};
	for (const [k, v] of Object.entries(subs_summary)) {
		subs_summary[k as keyof typeof subs_summary] = cleanVal(v);
	}
	return subs_summary as SubsSummary;
};

const summarizeData = (data: Omit<APIData, "_id">, type: ModelType): WepnSummary | ShipSummary | SubsSummary => {
	switch (type) {
		case 'ship':
			return summarizeShipData(data as APIShipData);
		case 'wepn':
			return summarizeWepnData(data as APIWepnData);
		case 'subs':
			return summarizeSubsData(data as APISubsData);
		case `unknown`:
			return summarizeWepnData(data as APIWepnData);
	}
};

export default async (arg_pairs: { type: ModelType, name: string }, flags: string[]) => {
	const url = new URL(process.env.API_LINK!);
	const params = new URLSearchParams();
	params.append(`type`, arg_pairs.type);
	params.append(`name`, arg_pairs.name);
	url.search = params.toString();
	try {
		logger.verbose(`Fetching!: ${url.href}`);
		const res = await fetch(url);
		const [data, ...others] = (await res.json() as APIData[]).sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
		if (data) {
			logger.verbose(`Got data...`);
			const _data = (() => {
				const _: Partial<typeof data> = { ...data };
				delete _._id;
				return _ as Omit<typeof data, "_id">;
			})();

			if (flags.includes(InfoFlags.ALL)) {
				const res = await Glot.create({
					title: `${_data.name} (ver ${process.env.DATA_VERSION ?? `unknown`})`,
					files: [
						{
							name: `${arg_pairs.type} data`,
							content: prettyPrintObj(_data)
						},
						{
							name: `summary`,
							content: prettyPrintObj(summarizeData(_data, arg_pairs.type))
						},
						{
							name: `raw`,
							content: JSON.stringify(_data)
						}
					],
					language: `plaintext`,
					public: true
				});
				logger.verbose("res: %o", res);
				return {
					glot: {
						title: res.title,
						link: `${Glot.res_url}/${res.id}`
					},
					others,
					url,
					raw: data
				};
			} else { // else return only 'important' info, prettified
				return {
					data: summarizeData(data, arg_pairs.type),
					others,
					url,
					raw: data
				};
			}
		}
	} catch (err) {
		console.error(err);
		console.trace();
	}
	return {
		url
	};
};
