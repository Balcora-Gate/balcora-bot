import { PARAM_ALIASES } from './params';
import { CommandType } from './command';

export const paramResolver = (cmd_name: CommandType) => (param_type: keyof typeof PARAM_ALIASES[keyof typeof PARAM_ALIASES]) => (param_alias: string) => {
	return Object.entries(PARAM_ALIASES[cmd_name][param_type]).find(([real_name, aliases]) => {
		return param_alias === real_name || aliases.includes(param_alias);
	})?.[0];
};
