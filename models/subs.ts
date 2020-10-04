export type SubsType = `System` | `Weapon`;

export type SubsSummary = {
	'Name': string,
	'Type': SubsType,
	'Hitpoints': number,
	'Build Cost': number,
	'Build Time': number,
	'Regen Time': number,
	'Innate': boolean,
	'Visible': boolean,
	'Linked Weapon': string,
};