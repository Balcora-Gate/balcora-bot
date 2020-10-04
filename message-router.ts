import { Message } from 'discord.js';
import logger from './logger';
import infoCommand from './info-command';
import { Flags, parseInputArgs, parseInputFlags } from './parsing';

const isBotCommand = (msg_content: string) => {
	const prepend = msg_content.slice(0, 3);
	return prepend.toLowerCase() === `bb `;
};

const dispatchCommand = (cmd_type: string, args: { [key: string]: string }, flags: Flags) => {
	switch (cmd_type.toLowerCase()) {
		case `info`:
			return infoCommand(args, flags);
		default:
			return undefined;
	}
};

export default async (msg: Message) => {
	const content = msg.content;

	if (isBotCommand(content)) {
		const [ type, ...payload ] = [...content.matchAll(/^bb\s+(.+)/gm)][0][1].split(/\s+/gm); // split into cmd type | payload
		logger.verbose(type);
		logger.verbose(payload);

		const args = parseInputArgs(payload);
		logger.verbose(`args: %o`, args);

		const flags = parseInputFlags(payload);
		logger.verbose(`flags: %o`, flags);

		logger.verbose(`router success`);
		return dispatchCommand(type, args, flags);
	}
	return undefined;
};