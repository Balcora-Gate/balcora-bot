import fs from 'fs';
import { CommandType } from './command';

export type AliasDictionary = {
	[key in CommandType]: {
		args: {
			[key: string]: string[]; // realname -> alias[]
		},
		flags: {
			[key: string]: string[]
		}
	};
};

export type CommandParamInfo = AliasDictionary[keyof AliasDictionary];
export type CommandParamList = CommandParamInfo[keyof CommandParamInfo]; // args/flags
export type Args = {[key: string]: string | number | undefined};
export type Flags = {[key: string]: boolean | undefined};

export const PARAM_ALIASES: AliasDictionary = JSON.parse(fs.readFileSync(`./param-aliases.json`, 'utf-8'));

export const getCommandParams = (cmd_type: CommandType) => {
	return PARAM_ALIASES[cmd_type];
};
