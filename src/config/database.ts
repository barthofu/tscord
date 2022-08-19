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

const envMikroORMConfig: { production: Options, development?: Options } = {

    production: {

        /**
         * SQLite
         */
        // type: 'sqlite',
        // dbName: `${databaseConfig.path}db.sqlite`,

        /**
         * MongoDB
         */
        type: 'mongo',
        dbName: process.env['DATABASE_NAME'],
        clientUrl: process.env['DATABASE_HOST'],

        /**
         * PostgreSQL
         */
        // type: 'postgresql',
        // dbName: process.env['DATABASE_NAME'],
        // host: process.env['DATABASE_HOST'],
        // port: 5432,
        // user: process.env['DATABASE_USER'],
        // password: process.env['DATABASE_PASSWORD'],

        /**
         * MySQL
         */
        // type: 'mysql',
        // dbName: process.env['DATABASE_NAME'],
        // host: process.env['DATABASE_HOST'],
        // port: 3306,
        // user: process.env['DATABASE_USER'],
        // password: process.env['DATABASE_PASSWORD'],

        /**
         * MariaDB
         */
        // type: 'mariadb',
        // dbName: process.env['DATABASE_NAME'],
        // host: process.env['DATABASE_HOST'],
        // port: 3306
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
    }

}

if (!envMikroORMConfig['development']) envMikroORMConfig['development'] = envMikroORMConfig['production']

export const mikroORMConfig = envMikroORMConfig