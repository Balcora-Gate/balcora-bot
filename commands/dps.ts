import { makeBalcoraEmbed } from "../discord-util";
import fetchInfo, { APIShipData, APIWepnData } from "../fetch-info";
import { padStrToLength, toCodeBlock } from "../formatting";
import logger from "../logger";
import { calcShotsPerSecond } from "../models/wepn";
import { getCommandParams } from "../params";
import Command from "./command";

export enum DPSArgs { SOURCE = `source`, TARGET = `target` }
export enum DPSFlags { VERBOSE = `verbose` }

export default class DPSCommand extends Command {
	constructor() {
		const { args, flags } = getCommandParams(`help`);
		super(`dps`, args, flags);
	}

	async execute(command_parts: string[]) {
		const { args, flags } = this.resolveParamAliases(command_parts);
		if (!args.source || !args.target) {
			return undefined;
		}

		const { source, target } = args;
		const [the_ship, the_weapon] = await Promise.all([
			fetchInfo({ type: `ship`, name: target }, []),
			fetchInfo({ type: `wepn`, name: source }, [])
		]);

		const embed = makeBalcoraEmbed();

		if (the_weapon.raw == null || the_ship.raw == null) {
			return embed
				.setTitle(`Error resolving name.`)
				.setDescription(`❌ Unable to resolve ${the_weapon.raw == null ? 'weapon' : 'ship'}: '${the_weapon.raw == null ? source : target}'`);
		}

		const ship_data = the_ship.raw! as { [key: string]: unknown } & APIShipData;
		const weapon_data = the_weapon.raw! as { [key: string]: unknown } & APIWepnData;

		const parts = {
			shots_per_second: calcShotsPerSecond(weapon_data.config as { [key: string]: unknown }),
			damage_mult: parseFloat(weapon_data.penetration.default_damage_mult as unknown as string),
			armour_pen: parseFloat(weapon_data.penetration[ship_data.attribs.ArmourFamily] as unknown as string),
			accuracy: parseFloat((weapon_data.accuracy[ship_data.attribs.AttackFamily] ?? weapon_data.accuracy.default_acc_mult) as unknown as string)
		};
		const parts_factor = Object.values(parts).reduce((acc, part) => acc * part, 1);
		const min_effect = weapon_data.result.min_effect_val as number;
		const max_effect = weapon_data.result.max_effect_val as number;

		const min_dps = parts_factor * min_effect;
		const max_dps = parts_factor * max_effect;
		const avg_dps = (min_dps + max_dps) / 2;

		logger.verbose("parts: %o", parts);
		logger.info("effect -> min: %d\tmax: %d", weapon_data.result.min_effect_val as number, weapon_data.result.max_effect_val as number);
		logger.verbose("dps: %o", {
			min: min_dps,
			max: max_dps,
			avg: avg_dps
		});

		const objToPrettyStr = (acc: string, [idx, val]: [string, unknown]) => `${acc}${padStrToLength(`${idx}:`, 24)}${val}\n`;
		embed
			.setTitle(`DPS Report:`)
			.setDescription(`For weapon \`${weapon_data.name}\` vs. ship \`${ship_data.name}\``)
			.addField("DPS", toCodeBlock(`Min: ${min_dps}\nMax: ${max_dps}\nAvg: ${avg_dps}`));

		if (flags.includes(DPSFlags.VERBOSE)) {
			embed.addField(
				"Calculation & Params",
				toCodeBlock(
					`${Object.entries({
						...parts,
						min_effect,
						max_effect
					}).reduce(objToPrettyStr, ``)
					}\n\nbase = (${Object.keys(parts).join(` * `)
					}),\n\t= ${parts_factor
					},\nmin_dps = base * min_effect\n\t= ${parts_factor
					} * ${min_effect}\n\t= ${min_dps},\nmax_dps = base * max_effect\n\t= ${parts_factor
					} * ${max_effect}\n\t= ${max_dps}\navg_dps = (min_dps + max_dps) / 2\n\t= ${avg_dps}`
				)
			);
		}
		return embed;
	}
}