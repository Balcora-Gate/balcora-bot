import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);

import { makeBalcoraEmbed } from "../discord-util";
import { toCodeBlock } from "../formatting";
import Command from './command';
import { COMMAND_LIST } from '../command';
import { getCommandParams } from '../params';

export default class HelpCommand extends Command {
	constructor() {
		const { args, flags } = getCommandParams(`help`);
		super(`help`, args, flags);
	}

	async execute(command_parts: string[]) {
		const { args } = this.resolveParamAliases(command_parts);


		const embed = makeBalcoraEmbed();
		if (!args.command) {
			// ret cmd list, and tell them to use -command (-c) <command> for details on a specific command
			const possible_command_str = COMMAND_LIST.join(`, `);
			return embed
				.setTitle(`Help`)
				.setURL(`https://github.com/Balcora-Gate/balcora-bot/blob/master/README.md#balcora-bot`)
				.setDescription(`Use \`bb help <command>\` for more detailed information about that command.`)
				.addFields([
					{
						name: `Possible commands:`,
						value: toCodeBlock(possible_command_str)
					}
				]);
		} else {
			const docs_url = `https://github.com/Balcora-Gate/balcora-bot/blob/master/docs/${args.command}.md#${args.command}`;
			const contents = (await readFile(`./docs/${args.command}.md`, `utf-8`));
			// logger.verbose(`contents: %o`, contents);
			const summary = contents.match(/# \w+[\n\r]*?([^\n]+)[\n\r]*?##/)?.[1];
			return embed
				.setTitle(`Help: ${args.command}`)
				.setURL(docs_url)
				.setDescription(summary ?? `Unable to find help for this command!`)
				.addFields([
					{
						name: `Full help for ${args.command}:`,
						value: docs_url
					}
				]);
		}
	}
}
