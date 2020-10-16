import { MessageEmbed } from 'discord.js';
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);

import Commands from '../command';
import { makeBalcoraEmbed } from "../discord-util";
import { toCodeBlock } from "../formatting";
import logger from '../logger';

export default async (args: { command?: keyof typeof Commands }): Promise<MessageEmbed> => {
	const embed = makeBalcoraEmbed();
	if (!args.command) {
		// ret cmd list, and tell them to use -command (-c) <command> for details on a specific command
		const possible_command_str = Object.keys(Commands).join(`, `);
		logger.verbose(`str: ${possible_command_str}`);
		logger.verbose(`obj: %o`, Commands);
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
		logger.verbose(`summary: %o`, summary);
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
};