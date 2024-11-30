import process from 'node:process'

import { cleanEnv, num, str } from 'envalid'

import { apiConfig, generalConfig, mikroORMConfig } from '@/configs'

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ['development', 'production'], default: 'development' }),

	BOT_TOKEN: str(),
	TEST_GUILD_ID: str(),
	BOT_OWNER_ID: str(),

	DATABASE_HOST: str({ default: undefined }),
	DATABASE_PORT: num({ default: undefined }),
	DATABASE_NAME: str({ default: undefined }),
	DATABASE_USER: str({ default: undefined }),
	DATABASE_PASSWORD: str({ default: undefined }),

	API_PORT: num({ default: undefined }),
	API_ADMIN_TOKEN: str({ default: undefined }),

	IMGUR_CLIENT_ID: str({ default: undefined }),
})

export function checkEnvironmentVariables() {
	const config = mikroORMConfig[env.NODE_ENV]
	// @ts-expect-error
	const isSqliteDatabase = !!config.dbName && !config.port
	if (isSqliteDatabase) {
		cleanEnv(process.env, {
			DATABASE_HOST: str(),
			DATABASE_PORT: num(),
			DATABASE_NAME: str(),
			DATABASE_USER: str(),
			DATABASE_PASSWORD: str(),
		})
	}

	if (apiConfig.enabled === true) {
		cleanEnv(process.env, {
			API_PORT: num(),
			API_ADMIN_TOKEN: str(),
		})
	}

	if (generalConfig.automaticUploadImagesToImgur === true) {
		cleanEnv(process.env, {
			IMGUR_CLIENT_ID: str(),
		})
	}
}
