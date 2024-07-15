import process from 'node:process'

import { cleanEnv, host, port, str } from 'envalid'

import { apiConfig, generalConfig, mikroORMConfig } from '@/configs'

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ['production', 'development'] }),

	BOT_TOKEN: str(),
	TEST_GUILD_ID: str({ default: '' }),
	BOT_OWNER_ID: str({ default: '' }),

	DATABASE_HOST: host({ default: undefined }),
	DATABASE_PORT: port({ default: undefined }),
	DATABASE_NAME: str({ default: undefined }),
	DATABASE_USER: str({ default: undefined }),
	DATABASE_PASSWORD: str({ default: undefined }),

	API_PORT: port({ default: 4000 }),
	API_ADMIN_TOKEN: str({ default: undefined }),

	IMGUR_CLIENT_ID: str({ default: undefined }),
})

export function checkEnvironmentVariables() {
	const config = mikroORMConfig[env.NODE_ENV]
	// @ts-expect-error
	const isSqliteDatabase = !!config.dbName && !config.port
	if (isSqliteDatabase) {
		cleanEnv(env, {
			DATABASE_HOST: host(),
			DATABASE_PORT: port(),
			DATABASE_NAME: str(),
			DATABASE_USER: str(),
			DATABASE_PASSWORD: str(),
		})
	}

	if (apiConfig.enabled === true) {
		cleanEnv(env, {
			API_PORT: port(),
			API_ADMIN_TOKEN: str(),
		})
	}

	if (generalConfig.automaticUploadImagesToImgur === true) {
		cleanEnv(env, {
			IMGUR_CLIENT_ID: str(),
		})
	}
}
