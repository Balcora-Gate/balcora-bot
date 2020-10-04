import fetch from 'node-fetch';
import { URLSearchParams, URL } from 'url';

import logger from './logger';
import ModelType from './models/model_types';
import { WepnSummary, calcShotsPerSecond } from './models/wepn';
import { ShipSummary } from './models/ship';
import { SubsSummary, SubsType } from './models/subs';

import * as Glot from './glot-io';
import { prettyPrintObj } from './formatting';
import { Flags } from './parsing';

const cleanVal = (val: string | number | undefined) => {
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

const summarizeWepnData = (data: {[key: string]: any}): WepnSummary => {
	const pretty_wepn = {
		'Name': data.name,
		'Effect': data.result.effect,
		'Target': data.result.target,
		'Effect Type': data.config.fire_type,
		'Min Effect': data.result.min_effect_val,
		'Max Effect': data.result.max_effect_val,
		'Weapon Type': data.config.type,
		'Projectile Speed': data.config.projectile_speed,
		'Shots/s': calcShotsPerSecond(data.config),
		'Spawn Effect': data.result.spawned_weapon_effect
	};
	for (const [k, v] of Object.entries(pretty_wepn)) {
		pretty_wepn[k as keyof WepnSummary] = cleanVal(v);
	}
	return pretty_wepn;
};

const summarizeShipData = (data: {[key: string]: any}): ShipSummary => {
	const pretty_ship = {
		'Name': data.name,
		'Class': data.attribs.DisplayFamily,
		'Hitpoints': data.attribs.maxhealth,
		'Build Cost': data.attribs.buildCost,
		'Build Time': data.attribs.buildTime,
		'Max Forward Speed': data.attribs.mainEngineMaxSpeed,
		'Max Strafe Speed': data.attribs.thrusterMaxSpeed,
		'Armour Type': data.attribs.ArmourFamily,
		'Linked Weapons': [],
	};
	for (const [k, v] of Object.entries(pretty_ship)) {
		pretty_ship[k as keyof ShipSummary] = cleanVal(v);
	}
	return pretty_ship;
};

const summarizeSubsData = (data: {[key: string]: any}): SubsSummary => {
	const pretty_subs = {
		'Name': data.name,
		'Type': (data.weapon === null ? `System` : `Weapon`) as SubsType,
		'Hitpoints': data.attribs.maxhealth,
		'Regen Time': data.attribs.regentime,
		'Build Cost': data.attribs.costToBuild,
		'Build Time': data.attribs.timeToBuild,
		'Innate': data.attribs.innate || false,
		'Visible': data.attribs.visible || false,
		'Linked Weapon': data.weapon
	};
	for (const [k, v] of Object.entries(pretty_subs)) {
		pretty_subs[k as keyof SubsSummary] = cleanVal(v);
	}
	return pretty_subs;
};

const summarizeData = (data: {[key: string]: any}, type: ModelType): WepnSummary | ShipSummary | SubsSummary => {
	switch (type) {
		case 'ship':
			return summarizeShipData(data);
		case 'wepn':
			return summarizeWepnData(data);
		case 'subs':
			return summarizeSubsData(data);
		case `unknown`:
			return summarizeWepnData(data);
	}
};

export default async (arg_pairs: { type: ModelType, name: string }, flags: Flags) => {
	try {
		const url = new URL(process.env.API_LINK!);
		const params = new URLSearchParams();
		params.append(`type`, arg_pairs.type);
		params.append(`name`, arg_pairs.name);
		url.search = params.toString();
		logger.verbose(`Fetching!: ${url.href}`);
		const res = await fetch(url);
		const [data, ...others]: {[key: string]: any}[] = (await res.json()).sort((a: any, b: any) => {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
		if (data) {
			delete data._id;
			if (flags.all) {
				const res = await Glot.create({
					title: `${data.name} (ver ${process.env.DATA_VERSION ?? `unknown`})`,
					files: [
						{
							name: `${data.type} data`,
							content: prettyPrintObj(data)
						},
						{
							name: `summary`,
							content: prettyPrintObj(summarizeData(data, arg_pairs.type))
						},
						{
							name: `raw`,
							content: JSON.stringify(data)
						}
					]
				});
				logger.verbose("res: %o", res);
				return {
					glot: {
						title: res.title,
						link: `${Glot.res_url}/${res.id}`
					},
					others,
					url
				};
			} else { // else return only 'important' info, prettified
				return {
					data: summarizeData(data, arg_pairs.type),
					others,
					url
				};
			}	
		}
	} catch (err) {
		logger.error(err);
		console.trace();
	}
	return {};
};
