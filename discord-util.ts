import { MessageEmbed } from "discord.js";

export const makeBalcoraEmbed = () => {
	return new MessageEmbed().setColor(`#e0683b`).addField(`2.3 ver:`, process.env.DATA_VERSION, false);
};
