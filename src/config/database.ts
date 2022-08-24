import { Options } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

import * as entities from '@entities'

export const databaseConfig: DatabaseConfigType = {
    
    path: './database/',
    
    backup: {
        enabled: true,
        path: './database/backups/'
    }
}

export const databaseType = 'sqlite' as const // 'sqlite' | 'postgres' | 'mysql' | 'mariadb' | 'mongo'

const envMikroORMConfig: { production: Options, development?: Options } = {

    production: {

        /**
         * SQLite
         */
        type: databaseType,
        dbName: `${databaseConfig.path}db.sqlite`,

        /**
         * MongoDB
         */
        // type: databaseType,
        // clientUrl: process.env['DATABASE_HOST'],

        /**
         * PostgreSQL
         */
        // type: databaseType,
        // dbName: process.env['DATABASE_NAME'],
        // host: process.env['DATABASE_HOST'],
        // port: Number(process.env['DATABASE_PORT']),,
        // user: process.env['DATABASE_USER'],
        // password: process.env['DATABASE_PASSWORD'],

        /**
         * MySQL
         */
        // type: databaseType,
        // dbName: process.env['DATABASE_NAME'],
        // host: process.env['DATABASE_HOST'],
        // port: Number(process.env['DATABASE_PORT']),
        // user: process.env['DATABASE_USER'],
        // password: process.env['DATABASE_PASSWORD'],

        /**
         * MariaDB
         */
        // type: databaseType,
        // dbName: process.env['DATABASE_NAME'],
        // host: process.env['DATABASE_HOST'],
        // port: Number(process.env['DATABASE_PORT']),
        // user: process.env['DATABASE_USER'],
        // password: process.env['DATABASE_PASSWORD'],

        entities: Object.values(entities),
        highlighter: new SqlHighlighter(),
        allowGlobalContext: true,
        debug: false,
        
        migrations: {
            path: './database/migrations',
            emit: 'js',
            snapshot: true
        }
    },

    development: {

    }
}

if (!envMikroORMConfig['development'] || envMikroORMConfig['development'] === {}) envMikroORMConfig['development'] = envMikroORMConfig['production']

export const mikroORMConfig = envMikroORMConfig