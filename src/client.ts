import { GatewayIntentBits, Partials } from "discord.js"

import { generalConfig, logsConfig } from "@config"
import { ExtractLocale, Maintenance, NotBot, RequestContextIsolator } from "@guards"

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
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	],

	partials: [
		Partials.Channel
	],

	// debug logs are disabled in silent mode
	silent: !logsConfig.debug,

	guards: [
		RequestContextIsolator,
		NotBot,
		Maintenance,
		ExtractLocale
	],

	// configuration for @SimpleCommand
	simpleCommand: {
		prefix: generalConfig.simpleCommandsPrefix,
	}
	
}