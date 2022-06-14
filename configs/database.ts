import { Options } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

import * as entities from '@entities'

const mikroORMConfig: Options = {
    type: 'sqlite',
    dbName: './database/db.sqlite',
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

export const databaseConfig = {
    
    type: "sqlite",

    mikroORMConfig,

    path: "./database/",
    backup: {
        enabled: false,
        interval: "daily",
        time: "00:00",
        path: ""
    }
}