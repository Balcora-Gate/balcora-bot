export type SubsType = `System` | `Weapon`;
export type SubsUsedBy = {
	ship: string[]
};

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
	'Used by Ships': string
};

export const parseUsedBySubs = (used_by: SubsUsedBy[keyof SubsUsedBy]): string => {
	return used_by?.join(`, `) ?? `<none>`;
};