import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {

	GUARDS: {
		DISABLED_COMMAND: 'This command is currently desactivated.',
		MAINTENANCE: 'This bot is currently in maintenance mode.',
		GUILD_ONLY: 'This command can only be used in a server.',
		NSFW: 'This command can only be used in a NSFW channel.',
	},

	ERRORS: {
		UNKNOWN: 'An unknown error occured.',
	},

	COMMANDS: {
		PREFIX: {
			CHANGED: 'Prefix changed to `{prefix:string}`.',
		},
		MAINTENANCE: {
			SUCCESS: 'Maintenance mode set to `{state:string}`.',
		},
		STATS: {
			HEADERS: {
				COMMANDS: 'Commands',
				GUILD: 'Guild',
				ACTIVE_USERS: 'Active Users',
				USERS: 'Users',
			}
		}
	},
}

export default en
