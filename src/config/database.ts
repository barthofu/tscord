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

export const mikroORMConfig: Options = {
    type: 'sqlite',
    dbName: `${databaseConfig.path}db.sqlite`,
    entities: Object.values(entities),
    highlighter: new SqlHighlighter(),
    allowGlobalContext: true,
    debug: false,
    migrations: {
        path: './database/migrations',
        emit: 'ts',
        snapshot: true
    }
}