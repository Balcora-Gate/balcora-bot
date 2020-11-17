import { Message } from 'discord.js';
import logger from './logger';
import Commands from './command';

const isBotCommand = (msg_content: string) => {
	const prepend = msg_content.slice(0, 3);
	return prepend.toLowerCase() === `bb `;
};

const dispatchCommand = (cmd_type: string, command_parts: string[]) => {
	cmd_type = cmd_type.toLowerCase();
	const isObjKey = <T>(key: any, obj: T): key is keyof T => key in obj;
	if (isObjKey(cmd_type, Commands)) {
		return Commands[cmd_type].execute(command_parts);
	}
	return undefined;
};

export default async (msg: Message) => {
	logger.verbose(`routing...`);
	const content = msg.content;
	logger.verbose(`msg: ${msg.content}`);

	if (isBotCommand(content)) {
		const [ type, ...payload ] = [...content.matchAll(/^bb\s+(.+)/gm)][0][1].split(/\s+/gm); // split into cmd type | payload
		logger.verbose(type);
		logger.verbose(payload);

		logger.verbose(`router success`);
		return dispatchCommand(type, payload);
	}
	return undefined;
};