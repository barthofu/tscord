// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'
	| 'fr'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	GUARDS: {
		/**
		 * This command is currently desactivated.
		 */
		DISABLED_COMMAND: string
		/**
		 * This bot is currently in maintenance mode.
		 */
		MAINTENANCE: string
		/**
		 * This command can only be used in a server.
		 */
		GUILD_ONLY: string
		/**
		 * This command can only be used in a NSFW channel.
		 */
		NSFW: string
	}
	ERRORS: {
		/**
		 * An unknown error occured.
		 */
		UNKNOWN: string
	}
	COMMANDS: {
		INVITE: {
			/**
			 * Invite the bot to your server!
			 */
			DESCRIPTION: string
			EMBED: {
				/**
				 * Invite me on your server!
				 */
				TITLE: string
				/**
				 * [Click here]({link}) to invite me!
				 * @param {unknown} link
				 */
				DESCRIPTION: RequiredParams<'link'>
			}
		}
		PREFIX: {
			/**
			 * Change the prefix of the bot.
			 */
			DESCRIPTION: string
			EMBED: {
				/**
				 * Prefix changed to `{prefix}`.
				 * @param {string} prefix
				 */
				DESCRIPTION: RequiredParams<'prefix'>
			}
		}
		MAINTENANCE: {
			/**
			 * Set the maintenance mode of the bot.
			 */
			DESCRIPTION: string
			EMBED: {
				/**
				 * Maintenance mode set to `{state}`.
				 * @param {string} state
				 */
				DESCRIPTION: RequiredParams<'state'>
			}
		}
		STATS: {
			/**
			 * Get some stats about the bot.
			 */
			DESCRIPTION: string
			HEADERS: {
				/**
				 * Commands
				 */
				COMMANDS: string
				/**
				 * Guild
				 */
				GUILDS: string
				/**
				 * Active Users
				 */
				ACTIVE_USERS: string
				/**
				 * Users
				 */
				USERS: string
			}
		}
		HELP: {
			/**
			 * Get global help about the bot and its commands
			 */
			DESCRIPTION: string
			EMBED: {
				/**
				 * Help pannel
				 */
				TITLE: string
				/**
				 * {category} Commands
				 * @param {string} category
				 */
				CATEGORY_TITLE: RequiredParams<'category'>
			}
			SELECT_MENU: {
				/**
				 * Select a category
				 */
				TITLE: string
				/**
				 * {category} commands
				 * @param {string} category
				 */
				CATEGORY_DESCRIPTION: RequiredParams<'category'>
			}
		}
		PING: {
			/**
			 * Pong!
			 */
			DESCRIPTION: string
			/**
			 * {member} Pong! The message round-trip took {time}ms.{heartbeat}
			 * @param {string} heartbeat
			 * @param {string} member
			 * @param {number} time
			 */
			MESSAGE: RequiredParams<'heartbeat' | 'member' | 'time'>
		}
	}
}

export type TranslationFunctions = {
	GUARDS: {
		/**
		 * This command is currently desactivated.
		 */
		DISABLED_COMMAND: () => LocalizedString
		/**
		 * This bot is currently in maintenance mode.
		 */
		MAINTENANCE: () => LocalizedString
		/**
		 * This command can only be used in a server.
		 */
		GUILD_ONLY: () => LocalizedString
		/**
		 * This command can only be used in a NSFW channel.
		 */
		NSFW: () => LocalizedString
	}
	ERRORS: {
		/**
		 * An unknown error occured.
		 */
		UNKNOWN: () => LocalizedString
	}
	COMMANDS: {
		INVITE: {
			/**
			 * Invite the bot to your server!
			 */
			DESCRIPTION: () => LocalizedString
			EMBED: {
				/**
				 * Invite me on your server!
				 */
				TITLE: () => LocalizedString
				/**
				 * [Click here]({link}) to invite me!
				 */
				DESCRIPTION: (arg: { link: unknown }) => LocalizedString
			}
		}
		PREFIX: {
			/**
			 * Change the prefix of the bot.
			 */
			DESCRIPTION: () => LocalizedString
			EMBED: {
				/**
				 * Prefix changed to `{prefix}`.
				 */
				DESCRIPTION: (arg: { prefix: string }) => LocalizedString
			}
		}
		MAINTENANCE: {
			/**
			 * Set the maintenance mode of the bot.
			 */
			DESCRIPTION: () => LocalizedString
			EMBED: {
				/**
				 * Maintenance mode set to `{state}`.
				 */
				DESCRIPTION: (arg: { state: string }) => LocalizedString
			}
		}
		STATS: {
			/**
			 * Get some stats about the bot.
			 */
			DESCRIPTION: () => LocalizedString
			HEADERS: {
				/**
				 * Commands
				 */
				COMMANDS: () => LocalizedString
				/**
				 * Guild
				 */
				GUILDS: () => LocalizedString
				/**
				 * Active Users
				 */
				ACTIVE_USERS: () => LocalizedString
				/**
				 * Users
				 */
				USERS: () => LocalizedString
			}
		}
		HELP: {
			/**
			 * Get global help about the bot and its commands
			 */
			DESCRIPTION: () => LocalizedString
			EMBED: {
				/**
				 * Help pannel
				 */
				TITLE: () => LocalizedString
				/**
				 * {category} Commands
				 */
				CATEGORY_TITLE: (arg: { category: string }) => LocalizedString
			}
			SELECT_MENU: {
				/**
				 * Select a category
				 */
				TITLE: () => LocalizedString
				/**
				 * {category} commands
				 */
				CATEGORY_DESCRIPTION: (arg: { category: string }) => LocalizedString
			}
		}
		PING: {
			/**
			 * Pong!
			 */
			DESCRIPTION: () => LocalizedString
			/**
			 * {member} Pong! The message round-trip took {time}ms.{heartbeat}
			 */
			MESSAGE: (arg: { heartbeat: string, member: string, time: number }) => LocalizedString
		}
	}
}

export type Formatters = {}
