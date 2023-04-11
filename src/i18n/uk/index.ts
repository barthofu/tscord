/* eslint-disable */
import type { Translation } from '../i18n-types'

const uk = {
	GUARDS: {
		DISABLED_COMMAND: 'Ця команда на разі відключена',
		MAINTENANCE: 'На разі ведуться технічні роботи!',
		GUILD_ONLY: 'Цю команду можна використовувати тільки на сервері!',
		NSFW: 'Ця команда може бути використана тільки в каналі для дорослих!',
	},
	ERRORS: {
		UNKNOWN: 'Сталася невідома помилка!',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'Опис відсутній.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Запросити бота до себе додому!',
			EMBED: {
				TITLE: 'Запроси мене до себе на сервер!',
				DESCRIPTION: '[Тисни тут]({link}) щоб я мав доступ!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Змінити префікс команд.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'Новий префікс для команд боту.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Префікс змінено на `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Встановити режим проведення технічних робіт.',
			EMBED: {
				DESCRIPTION: 'Режим технічних робіт встановлено на `{state}`.',
			},
		},
		STATS: {
			DESCRIPTION: 'Подивитись статистику бота.',
			HEADERS: {
				COMMANDS: 'Команди',
				GUILDS: 'Гільдії',
				ACTIVE_USERS: 'Активні користувачі',
				USERS: 'Користувачі',
			},
		},
		HELP: {
			DESCRIPTION: 'Загальна допомога по боту та його командам',
			EMBED: {
				TITLE: 'Панель допомоги',
				CATEGORY_TITLE: '{category} команди',
			},
			SELECT_MENU: {
				TITLE: 'Вибери категорію',
				CATEGORY_DESCRIPTION: '{category} команди',
			},
		},
		PING: {
			DESCRIPTION: "Перевірка зв'язку!",
			MESSAGE: '{member} Чути добре! Генерація повідомлення зайняла {time} мілісекунд. {heartbeat}',
		},
	},
} satisfies Translation

export default uk
