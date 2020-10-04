export type ShipClass = 
	`Fighter` |
	`Corvette` |
	`Frigate` |
	`Capital` |
	`Flagship` |
	`Platform` |
	`Utility` |
	`Resource` |
	`Noncombat` |
	`SubsystemModule` |
	`SubsystemSensors` |
	`Munition` |
	`Megalith`;

export type ArmourType =
	`Unarmoured` |
	`Unarmoured_hw1` |
	`LightArmour` |
	`LightArmour_hw1` |
	`MediumArmour` |
	`HeavyArmour` |
	`SubsystemArmour` |
	`TurretArmour` |
	`ResArmour` |
	`MoverArmour` |
	`PlanetKillerArmour` |
	`MineArmour` |
	`ChunkArmour` |
	`ResourceArmour` |
	`GravityWellArmour` |
	`SwarmerArmor` | // these new types drop the UK spelling ('armour' -> 'armor')
	`SpaceMineArmor` |
	`TorpedoArmor` |
	`HeavyMissileArmor` |
	`SmallMissileArmor` |
	`ProbeArmor`;

export type ShipSummary = {
	'Name': string,
	'Class': ShipClass,
	'Hitpoints': number,
	'Build Cost': number,
	'Build Time': number,
	'Max Forward Speed': number,
	'Max Strafe Speed': number,
	'Armour Type': ArmourType,
	'Linked Weapons': string[]
};