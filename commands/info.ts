import { makeBalcoraEmbed } from "../discord-util";
import fetchInfo from "../fetch-info";
import { toCodeBlock, prettyPrintObj } from "../formatting";
import ModelType from "../models/model_types";
import { Flags } from "../parsing";

export default async (args: { type?: string, name?: string }, flags: Flags) => {
	if (!args.type || !args.name) {
		return undefined;
	}
	const {data, others, url, glot } = await fetchInfo({ type: args.type as ModelType, name: args.name }, flags);
	const embed = makeBalcoraEmbed()
		.addField(`2.3 ver:`, process.env.DATA_VERSION, false);
	if (url) {
		const balcora_gate_url = `${process.env.BALCORA_REF_LINK!}?name=${args.name}&type=${args.type}`;

		// hacky, pls refactor
		const and_others_str = others?.length && others.length > 5 ? `... and **${others.length - 5}** others.` : ``;
		const top_5_others_str = others?.slice(0, 5).reduce((acc, entity) => {
			if (acc.length) return `${acc}, \`${entity.name}\``;
			else return `\`${entity.name}\``;
		}, ``);
		const also_found_str = others?.length ? `⚠️ Also indexed: ${top_5_others_str}${and_others_str}` : ``;
		
		const balcora_link = `On balcora: ${balcora_gate_url}`;
		const direct_api_link = `API: ${url.href}`;
		if (glot) {
			return embed
				.setTitle(glot.title)
				.setURL(glot.link)
				.setDescription(also_found_str)
				.addField(`Reference:`, `${balcora_link}\n${direct_api_link}`)
				.addField(`Data:`, glot.link, true);
		} else if (data) {
			const data_str = (() => {
				if (flags?.all) {
					return toCodeBlock(JSON.stringify(data));
				} else {
					return toCodeBlock(prettyPrintObj(data));
				}
			})();
			return embed
				.setTitle(data.Name ?? `Data`)
				.setURL(balcora_gate_url)
				.setDescription(also_found_str)
				.addField(`Reference:`, `${balcora_link}\n${direct_api_link}`)
				.addField(`Data:`, data_str);
		}
	}
	return embed
		.setTitle(`Search data`)
		.setURL(process.env.BALCORA_REF_LINK!)
		.setDescription(`**❌ No data found!**`)
		.addFields([
			{
				name: `Name:`,
				value: `\`${args.name ?? `**Not defined!**`}\``
			},
			{
				name: `Category (type):`,
				value: `\`${args.type ?? `**Not defined!**`}\``
			},
			{
				name: `Search:`,
				value: url?.href ?? `**Not defined!**`
			}
		]);
};
