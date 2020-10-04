import { resolveArg, resolveFlag } from './args';

export const parseInputArgs = (payload: string[]) => {
	return payload.reduce((acc: { [key: string]: any }, word: string) => {
		if (word.length > 1 && /^-\w+/gm.test(word)) { // word beginning with '-' is an arg
			const raw = word.slice(1);
			const parsed = resolveArg(raw);
			acc.args[parsed] = null;
			acc.last.key = parsed;
		} else if (acc.last.key !== null) { // words after arg words are values
			acc.args[acc.last.key] = word;
			acc.last.key = null;
		}
		return acc;
	}, {
		last: {
			key: null,
		},
		args: {}
	}).args;
};

export type Flags = {
	all?: boolean,
};

export const parseInputFlags = (payload: string[]) => {
	const flags = payload.reduce((acc: { [key: string]: any }, word: string) => {
		const pattern = /^--\w+/gm;
		if (word.length > 2 && pattern.test(word)) {
			const raw = word.slice(2);
			const parsed = resolveFlag(raw);
			acc.flags[parsed] = true;
		}
		return acc;
	}, {
		flags: {},
	}).flags as Flags;

	return flags;
};