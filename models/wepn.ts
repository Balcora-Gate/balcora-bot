export type WepnEffect = `Damage`;
export type WepnTarget = `Self` | `Enemy`;
export type WepnEffectType = `InstantHit` | `Bullet` | `Missile` | `Mine` | `SphereBurst`;
export type WepnType = `Fixed` | `Gimble` | `AnimatedTurret`;
export type WepnUsedBy = {
	ship: string[] | null,
	subs: string[] | null
};

export type WepnSummary = {
	'Name': string,
	'Effect': WepnEffect,
	'Target': WepnTarget,
	'Effect Type': WepnEffect,
	'Min Effect': number,
	'Max Effect': number,
	'Weapon Type': WepnType,
	'Projectile Speed': number,
	'Shots/s': number,
	'Spawn Effect': WepnEffectType,
	'Used by Ships': string,
	'Used by Subs': string
};

export const calcShotsPerSecond = (wepn_config: { [key: string]: any }): number => {
	const fire_burst_duration = parseFloat(wepn_config.fire_burst_duration);
	const time_between_shots = parseFloat(wepn_config.time_between_shots);
	const time_between_bursts = parseFloat(wepn_config.time_between_bursts);
	return parseFloat((() => {
		if (fire_burst_duration === 0) {
			return (1 / time_between_shots);
		} else {
			return ((fire_burst_duration / time_between_shots) / time_between_bursts);
		}
	})().toFixed(2));
};

export const parseUsedByWepn = (used_by: WepnUsedBy[keyof WepnUsedBy]): string => {
	return used_by?.join(`, `) ?? `<none>`;
};
