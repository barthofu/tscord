import { Options } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

// eslint-disable-next-line unused-imports/no-unused-imports
import { env } from '@/env'

type Config = {
	production: Options
	development?: Options
}

export const databaseConfig: DatabaseConfigType = {

	path: './database/', // path to the folder containing the migrations and SQLite database (if used)

	// config for setting up an automated backup of the database (ONLY FOR SQLITE)
	backup: {
		enabled: false,
		path: './database/backups/', // path to the backups folder (should be in the database/ folder)
	},
}

const envMikroORMConfig = {

	production: {

		/**
		 * SQLite
		 */
		type: 'better-sqlite', // or 'sqlite'
		dbName: `${databaseConfig.path}db.sqlite`,

		/**
		 * MongoDB
		 */
		// type: 'mongo',
		// clientUrl: env['DATABASE_HOST'],

		/**
		 * PostgreSQL
		 */
		// type: 'postgresql',
		// dbName: env['DATABASE_NAME'],
		// host: env['DATABASE_HOST'],
		// port: Number(env['DATABASE_PORT']),,
		// user: env['DATABASE_USER'],
		// password: env['DATABASE_PASSWORD'],

		/**
		 * MySQL
		 */
		// type: 'mysql',
		// dbName: env['DATABASE_NAME'],
		// host: env['DATABASE_HOST'],
		// port: Number(env['DATABASE_PORT']),
		// user: env['DATABASE_USER'],
		// password: env['DATABASE_PASSWORD'],

		/**
		 * MariaDB
		 */
		// type: 'mariadb',
		// dbName: env['DATABASE_NAME'],
		// host: env['DATABASE_HOST'],
		// port: Number(env['DATABASE_PORT']),
		// user: env['DATABASE_USER'],
		// password: env['DATABASE_PASSWORD'],

		highlighter: new SqlHighlighter(),
		debug: false,

		migrations: {
			path: './database/migrations',
			emit: 'js',
			snapshot: true,
		},
	},

	development: {

	},

} satisfies Config

if (!envMikroORMConfig.development || Object.keys(envMikroORMConfig.development).length === 0)
	envMikroORMConfig.development = envMikroORMConfig.production

export const mikroORMConfig = envMikroORMConfig as {
	production: typeof envMikroORMConfig['production']
	development: typeof envMikroORMConfig['production']
}
