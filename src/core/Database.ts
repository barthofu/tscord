import { singleton } from 'tsyringe'

import * as entities from '@entities'

import config from '../../config.json'
import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: config.database.path + 'db.sqlite',
    logging: true,
    entities: Object.values(entities),
    migrations: [config.database.path + 'migrations/*.ts'],
    subscribers: [],
})

@singleton()
export default class DatabaseStore {

    private _dataSource: DataSource

    constructor() {

        this._dataSource = dataSource
    }

    async initialize() {
            
        await this._dataSource.initialize()
    }
}