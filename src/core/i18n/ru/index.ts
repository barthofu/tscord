/* eslint-disable */
import type { Translation } from '../i18n-types'

const ru = {
	GUARDS: {
		DISABLED_COMMAND: 'Эта команда на данный момент не доступна.',
		MAINTENANCE: 'Бот закрыт на техническое обслуживание.',
		GUILD_ONLY: 'Эту команду можно использовать только на сервере.',
		NSFW: 'Эта команда доступна только в чатах 18+.',
	},
	ERRORS: {
		UNKNOWN: 'Произошла непонятная ошибка.',
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'Описание отсутствует.',
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Пригласить бота на свой сервер!',
			EMBED: {
				TITLE: 'Хочешь видеть меня у себя на сервере?',
				DESCRIPTION: '[Жми здесь]({link}) чтобы добавить бота!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Изменить префикс для бота.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'Новый префикс для бота.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Префикс бота изменен на `{prefix}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Установить режим технического обслуживания бота.',
			EMBED: {
				DESCRIPTION: 'Режим Технического Обслуживания установлен на `{state}`.',
			},
		},
		STATS: {
			DESCRIPTION: 'Получить статистику по боту.',
			HEADERS: {
				COMMANDS: 'Команды',
				GUILDS: 'Сервера',
				ACTIVE_USERS: 'Активные пользователи',
				USERS: 'Пользователи',
			},
		},
		HELP: {
			DESCRIPTION: 'Глобальная справка по боту и его командам',
			EMBED: {
				TITLE: 'Панель помощи',
				CATEGORY_TITLE: '{category} команды',
			},
			SELECT_MENU: {
				TITLE: 'Выбери категорию',
				CATEGORY_DESCRIPTION: '{category} команды',
			},
		},
		PING: {
			DESCRIPTION: 'Тук-тук!',
			MESSAGE: '{member} Что нужно? Было потрачено {time} милисекунд на генерацию ответа. {heartbeat}',
		},
	},
} satisfies Translation

export default ru
