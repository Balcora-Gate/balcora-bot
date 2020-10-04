import dotenv from 'dotenv';
dotenv.config();
import Discord, { Message, MessageEmbed, NewsChannel, TextChannel } from 'discord.js';

import logger from './logger';
import messageRouter from './message-router';

const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);
client.on(`ready`, () => logger.info(`Ready`));
client.on(`error`, (err) => logger.error(err));

client.on(`message`, async (msg: Message) => {
	const resolveOriginName = (msg: Message) => {
		const chan = msg.channel;
		switch (chan.type) {
			case `dm`:
				return `DM::${msg.author.username}`;
			default:
				return `${msg.guild?.name}::${(chan as TextChannel | NewsChannel).name}`;
		}
	}
	logger.info(`[${resolveOriginName(msg)}] ${msg.author.username}: ${msg.content.length} chars`);
	const response = await messageRouter(msg);
	logger.verbose(`type: ${typeof response}`);
	if (response) {
		const msg_target = msg.channel.type === `dm` ? msg.author : msg.channel;
		// need to check if >2000 chars since disco api won't accept more than that
		// in this case we send it to hastebin and return a 60-min link
		msg_target.send(response);
	}
});
