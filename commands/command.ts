import { CommandType } from "../command";
import logger from "../logger";
import { CommandParamList } from "../params";
import { paramResolver } from "../parsing";

export type CommandCallback = (args: CommandParamList, flags: CommandParamList) => Promise<unknown>;

export interface PossibleParams {
	readonly possible_args: CommandParamList;
	readonly possible_flags: CommandParamList;
}

export type ResolvedParams = {
	args: {
		[key: string]: string
	},
	flags: string[]
};

export default abstract class Command implements PossibleParams {

	constructor(
		readonly name: CommandType,
		readonly possible_args: CommandParamList,
		readonly possible_flags: CommandParamList
	) {
		this.param_resolver = paramResolver(this.name);
		logger.verbose(`resolver OK: ${this.param_resolver} (${this.name})`);
	}

	private readonly param_resolver;

	get possible_params() {
		return {
			...this.possible_args,
			...this.possible_flags
		};
	}

	abstract execute(command_parts: string[]): Promise<unknown>;

	resolveParamAliases(command_parts: string[]): ResolvedParams {
		logger.verbose(`got parts: %o`, command_parts);
		type RPAccumulator = {
			args: { [key: string]: string | null },
			flags: string[],
			last_key?: string
		};
		const params = command_parts.reduce((acc: RPAccumulator, word: string) => {
			const is_arg = word.length > 1 && /^-\w+/gm.test(word); // words beginning with `-`
			const is_flag = word.length > 2 && /^--\w+/gm.test(word);
			logger.verbose(`word: ${word}: is_arg: ${is_arg}, is_flag: ${is_flag}`);
			const type_str = is_arg ? `args` : `flags`;
			if (!acc.last_key && (is_arg || is_flag)) { // if `last_key` is null, we're looking for a param
				const slice_amount = is_arg ? 1 : 2;
				const raw = word.slice(slice_amount);
				const parsed = this.param_resolver(type_str)(raw);
				logger.verbose(`raw was: ${raw}, parsed into: ${parsed}`);
				if (parsed === undefined) {
					return acc; // skip if bad param
				}
				if (is_arg) {
					acc.args[parsed] = null; // reserve for next pass value
					acc.last_key = parsed; // remember the key
				} else if (is_flag) {
					acc.flags.push(parsed);
				}
			} else if (acc.last_key) { // words after arg words are values
				acc.args[acc.last_key] = word; // value for this arg
				acc.last_key = undefined; // reset
			}
			return acc;
		}, {
			last_key: undefined,
			args: {},
			flags: [],
		});
		return {
			args: params.args as { [key: string]: string },
			flags: params.flags
		};
	}
}
