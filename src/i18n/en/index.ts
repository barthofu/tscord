import type { BaseTranslation } from "../i18n-types"

const en: BaseTranslation = {

	GUARDS: {
		DISABLED_COMMAND: "This command is currently disabled.",
		MAINTENANCE: "This bot is currently in maintenance mode.",
		GUILD_ONLY: "This command can only be used in a server.",
		NSFW: "This command can only be used in a NSFW channel.",
	},

	ERRORS: {
		UNKNOWN: "An unknown error occurred.",
	},

	COMMANDS: {
		INVITE: {
			DESCRIPTION: "Invite the bot to your server!",

			EMBED: {
				TITLE: "Invite me on your server!",
				DESCRIPTION: "[Click here]({link}) to invite me!"
			}
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: "Change the prefix of the bot.",
			OPTIONS: {
				PREFIX: {
					NAME: "new_prefix",
					DESCRIPTION: "The new prefix of the bot.",
				}
			},

			EMBED: {
				DESCRIPTION: "Prefix changed to `{prefix:string}`."
			}
		},
		MAINTENANCE: {
			DESCRIPTION: "Set the maintenance mode of the bot.",

			EMBED: {
				DESCRIPTION: "Maintenance mode set to `{state:string}`."
			}
		},
		STATS: {
			DESCRIPTION: "Get some stats about the bot.",

			HEADERS: {
				COMMANDS: "Commands",
				GUILDS: "Guild",
				ACTIVE_USERS: "Active Users",
				USERS: "Users",
			}
		},
		HELP: {
			DESCRIPTION: 'Get global help about the bot and its commands',

			EMBED: {
				TITLE: "Help panel",
				CATEGORY_TITLE: "{category:string} Commands",

			},

			SELECT_MENU: {
				TITLE: "Select a category",
				CATEGORY_DESCRIPTION: "{category:string} commands",
			}
		},
		PING: {
			DESCRIPTION: "Pong!",

			MESSAGE: "{member:string} Pong! The message round-trip took {time:number}ms.{heartbeat:string}"
		}
	},
}

export default en
