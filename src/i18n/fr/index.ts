import type { Translation } from '../i18n-types'

const fr: Translation = {

	GUARDS: {
		DISABLED_COMMAND: 'Cette commande est désactivée.',
		MAINTENANCE: 'Ce bot est en mode maintenance.',
		GUILD_ONLY: 'Cette commande ne peut être utilisée qu\'en serveur.',
		NSFW: 'Cette commande ne peut être utilisée que dans un salon NSFW.',
	},

	ERRORS: {
		UNKNOWN: 'Une erreur est survenue.',
	},

	COMMANDS: {
		INVITE: {
			TITLE: 'Invite moi sur ton serveur!',
			DESCRIPTION: '[Clique ici]({link}) pour m\'inviter!'
		},
		PREFIX: {
			CHANGED: 'Prefix changé en `{prefix}`.',
		},
		MAINTENANCE: {
			SUCCESS: 'Le mode maintenance a été définie à `{state}`.',
		},
		STATS: {
			HEADERS: {
				COMMANDS: 'Commandes',
				GUILDS: 'Serveurs',
				ACTIVE_USERS: 'Utilisateurs actifs',
				USERS: 'Utilisateurs',
			}
		},
		HELP: {
			TITLE: "Pannel d'aide",
			CATEGORY_TITLE: 'Commandes de {category}',
			SELECT_MENU: {
				TITLE: 'Sélectionnez une catégorie',
				CATEGORY_DESCRIPTION: 'Commandes de {category}',
			}
		},
	},
}

export default fr
