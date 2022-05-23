import { singleton } from 'tsyringe'
import { DataSource, DataSourceOptions } from 'typeorm'

import * as entities from 'src/entities'

import config from '../../config.json'

export const dataSourceOptions: DataSourceOptions = {
    type: 'better-sqlite3',
    database: config.database.path + 'db.sqlite',
    logging: true,
    entities: Object.values(entities),
    migrations: [config.database.path + 'migrations/*.ts'],
    subscribers: [],
}

// export an instance of the DataSource so the TypeORM CLI can work seamlessly
export const dataSourceForCli = new DataSource(dataSourceOptions)

@singleton()
export class Database extends DataSource {

    constructor() {
        super(dataSourceOptions)
    }
}
