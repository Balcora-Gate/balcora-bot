import { Message } from 'discord.js';
import logger from './logger';
import Commands from './command';
import { Flags, parseInputArgs, parseInputFlags } from './parsing';

const isBotCommand = (msg_content: string) => {
	const prepend = msg_content.slice(0, 3);
	return prepend.toLowerCase() === `bb `;
};

const dispatchCommand = (cmd_type: string, args: { [key: string]: string }, flags: Flags) => {
	cmd_type = cmd_type.toLowerCase();
	const isObjKey = <T>(key: any, obj: T): key is keyof T => key in obj;
	if (isObjKey(cmd_type, Commands)) {
		logger.verbose(`With args: %o`, args);
		logger.verbose(`With flags: %o`, flags);
		return Commands[cmd_type](args, flags);
	}
	return undefined;
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