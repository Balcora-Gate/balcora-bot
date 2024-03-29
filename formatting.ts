// import { stringify } from "querystring";

export const prettyPrintObj = (obj: { [key: string]: any }): string => {
	const _prettify = (o: { [key: string]: any }, indent_lvl = 0): string => {
		return Object.entries(o).reduce((acc, [k, v]) => {
			if (typeof v === `undefined` || v === null || v === undefined) {
				v = `<none>`;
			}
			if (typeof v === 'object') {
				v = _prettify(v, indent_lvl + 1);
			} else if (v instanceof Array) {
				v = `[\n
					${v.reduce((acc, val) => `${acc}${val},\n`, ``)}
				\n]`;
			}
			const indent_str = indent_lvl > 0 ? `\t`.repeat(indent_lvl) : ``;
			return `${acc}\n${indent_str}${k}: ${v}`;
		}, ``);
	};
	return _prettify(obj);
};

export const toCodeBlock = (str: string, lang = ``) => {
	const cb_delim = '```' + lang;
	return `${cb_delim}yaml\n${str}\n${cb_delim}`;
};

export const padStrToLength = (str: string, length: number, pad_char = ` `) => {
	pad_char = pad_char[0];
	const missing_length = Math.max(0, length - str.length);

	return `${str}${pad_char.repeat(missing_length)}`;
};