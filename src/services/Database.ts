import { singleton } from 'tsyringe'
import { EntityManager, EntityName, MikroORM } from '@mikro-orm/core'
import { backup, restore } from 'saveqlite'

import { Schedule } from '@decorators'
import { databaseConfig, mikroORMConfig } from '@config'

/**
 * Default data for the Data table (dynamic EAV key/value pattern) 
 */
export const defaultData = {

    maintenance: false,
    lastMaintenance: Date.now(),
    lastStartup: Date.now()
}

@singleton()
export class Database {

    private _orm: MikroORM

    public async initialize() {
        this._orm = await MikroORM.init()
    }

    public getOrm() {
        return this.orm
    }

    get orm(): MikroORM {
        return this._orm
    }

    get em(): EntityManager {
        return this.orm.em
    }

    /**
     * Shorthand to get custom and natives repositories
     * @param entity Entity of the custom repository to get
     */
    getRepo<T>(entity: EntityName<T>) {
        return this.orm.em.getRepository<T>(entity)
    }
    
    @Schedule('*/10 * * * * *')
    async backup() {
        
        if (!databaseConfig.backup.enabled) return

        const backupPath = databaseConfig.backup.path
        if (!backupPath) return console.log('Backup path not set, couldn\'t backup')

        const snapshotName = `snapshot-${Date.now()}.txt`
        const objectsPath = `${backupPath}objects/` as `${string}/`

        backup(
            mikroORMConfig.dbName!, 
            snapshotName, 
            objectsPath
        )
    }

}