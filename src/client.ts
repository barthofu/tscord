import { Constants, Intents } from 'discord.js'

import { Maintenance, NotBot } from '@guards'

import { generalConfig, logsConfig } from '@config'

export const clientConfig = {
	
	// to only use global commands (use @Guild for specific guild command), comment this line
	botGuilds: process.env.NODE_ENV === 'development' ? [process.env.TEST_GUILD_ID] : undefined,

	// discord intents
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.DIRECT_MESSAGES
	],

	partials: [
		Constants.PartialTypes.CHANNEL,
	],

	// debug logs are disabled in silent mode
	silent: !logsConfig.debug,

	guards: [
		NotBot,
		Maintenance
	],

	// configuration for @SimpleCommand
	simpleCommand: {
		prefix: generalConfig.simpleCommandsPrefix,
	}
	
}