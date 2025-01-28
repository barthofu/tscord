import { cleanEnv, num, str } from 'envalid'

import { env } from '@/env'
import { apiConfig, generalConfig, mikroORMConfig } from '@/configs'

export function checkEnvironmentVariables() {
	const config = mikroORMConfig[env.NODE_ENV]

	const isSqliteDatabase = config.hasOwnProperty('dbName') && config.dbName != "" && !config.hasOwnProperty('port')
	if (!isSqliteDatabase) {
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
