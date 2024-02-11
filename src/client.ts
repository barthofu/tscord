import { GatewayIntentBits, Partials } from 'discord.js'
import { ClientOptions } from 'discordx'

import { generalConfig, logsConfig } from '@/configs'
import { env } from '@/env'
import { ExtractLocale, Maintenance, NotBot, RequestContextIsolator } from '@/guards'

export function clientConfig(): ClientOptions {
	return {

		// to only use global commands (use @Guild for specific guild command), comment this line
		botGuilds: env.NODE_ENV === 'development' ? [env.TEST_GUILD_ID] : undefined,

		// discord intents
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent,
		],

		partials: [
			Partials.Channel,
			Partials.Message,
			Partials.Reaction,
		],

		// debug logs are disabled in silent mode
		silent: !logsConfig.debug,

		guards: [
			RequestContextIsolator,
			NotBot,
			Maintenance,
			ExtractLocale,
		],

		// configuration for @SimpleCommand
		simpleCommand: {
			prefix: generalConfig.simpleCommandsPrefix,
		},

	}
}
