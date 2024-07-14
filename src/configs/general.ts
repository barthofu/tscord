export const generalConfig: GeneralConfigType = {
	name: 'TSCord', // the name of your bot
	description: 'A fully-featured discord bot template written in Typescript, intended to provide a framework that\'s easy to use, extend and modify', // the description of your bot
	version: '2.3', // semver of your bot

	defaultLocale: 'en', // default language of the bot, must be a valid locale
	timezone: 'Etc/UTC', // default TimeZone to well format and localize dates (logs, stats, etc)

	simpleCommandsPrefix: '!', // default prefix for simple command messages (old way to do commands on discord)
	automaticDeferring: true, // enable or not the automatic deferring of the replies of the bot on the command interactions

	// useful links
	links: {
		botInvite: 'https://invite.example.com', // link to invite your bot to a server
		supportServer: 'https://discord.gg/Q4w4UEWaDY',
		gitRemoteRepo: 'https://github.com/barthofu/tscord',
	},

	automaticUploadImagesToImgur: false, // enable or not the automatic assets upload

	ownerId: '', // discord ID of the bot owner
	devs: [], // discord IDs of the devs that are working on the bot (you don't have to put the owner's id here)
	testGuildId: '', // server ID of testing guild

	// define the bot activities (phrases under its name). Types can be: PLAYING, LISTENING, WATCHING, STREAMING, COMPETING, CUSTOM
	activities: [
		{
			type: 'PLAYING',
			text: 'discord.js v14 with tscord',
		},
		{
			type: 'STREAMING',
			text: 'some knowledge',
		},
	],
}

// global colors
export const colorsConfig = {
	primary: '#2F3136',
}
