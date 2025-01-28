import process from 'node:process'

import { cleanEnv, num, str } from 'envalid'

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