import { env } from '@/env'

export const generalConfig: GeneralConfigType = {
	name: 'TSCord', // the name of your bot
	description: 'A fully-featured discord bot template written in Typescript, intended to provide a framework that\'s easy to use, extend and modify', // the description of your bot

	defaultLocale: 'en', // default language of the bot, must be a valid locale
	timezone: 'Etc/UTC', // default timezone to well format and localize dates (logs, stats, etc)

	simpleCommandsPrefix: '!', // default prefix for simple command messages (old way to do commands on discord)
	automaticDeferring: true, // enable or not the automatic deferring of the replies of the bot on the command interactions

	// useful links
	links: {
		botInvite: 'https://invite.example.com/', // link to invite your bot
		supportServer: 'https://discord.gg/Q4w4UEWaDY', // your bot's support server
		gitRepo: 'https://github.com/barthofu/tscord', // link to your bot's source code
	},

	automaticUploadImagesToImgur: false, // enable the automatic assets upload

	ownerId: env.BOT_OWNER_ID, // discord ID of the bot owner
	devs: [], // discord IDs of the devs that are working on the bot (you don't have to put the owner's id here)
	testGuildId: env.TEST_GUILD_ID, // server ID of testing guild

	// activities to cycle through every 15 seconds
	// statuses: online, dnd, idle, invisible
	// types: PLAYING, STREAMING, LISTENING, WATCHING, COMPETING, CUSTOM
	// url is required for STREAMING, must be twitch or youtube
	activities: [
		{
			status: 'online',
			type: 'PLAYING',
			name: 'discord.js v14 with tscord',
			url: '',
		},
		{
			status: 'online',
			type: 'STREAMING',
			name: 'some knowledge',
			url: 'https://twitch.tv/discord',
		},
	],
}
