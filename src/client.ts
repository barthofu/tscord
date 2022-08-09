import { GatewayIntentBits, Partials } from 'discord.js'

import { ExtractLocale, Maintenance, NotBot } from '@guards'

import { generalConfig, logsConfig } from '@config'

export const clientConfig = {
	
	// to only use global commands (use @Guild for specific guild command), comment this line
	botGuilds: process.env.NODE_ENV === 'development' ? [process.env.TEST_GUILD_ID] : undefined,

	// discord intents
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.DirectMessages
	],

	partials: [
		Partials.Channel
	],

	// debug logs are disabled in silent mode
	silent: !logsConfig.debug,

	guards: [
		NotBot,
		Maintenance,
		ExtractLocale
	],

	// configuration for @SimpleCommand
	simpleCommand: {
		prefix: generalConfig.simpleCommandsPrefix,
	}
	
}