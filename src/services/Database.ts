import { delay, inject, singleton } from 'tsyringe'
import { EntityManager, EntityName, MikroORM } from '@mikro-orm/core'
import { backup, restore } from 'saveqlite'

import { Schedule } from '@decorators'
import { Logger } from '@services'

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

    constructor(
        @inject(delay(() => Logger)) private logger: Logger
    ) { }

    private _orm: MikroORM

    public async initialize() {

        // initialize the ORM using the configuration exported in `mikro-orm.config.ts`
        this._orm = await MikroORM.init()

        // migrate to the latest migration
        await this._orm.getMigrator().up()
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
    
    /**
     * Create a snapshot of the database each day at 23:59:59
     */
    @Schedule('59 59 23 * * *')
    async backup() { 

        const { formatDate } = await import('@utils/functions') 
        
        if (!databaseConfig.backup.enabled) return

        const backupPath = databaseConfig.backup.path
        if (!backupPath) return this.logger.log('error', 'Backup path not set, couldn\'t backup')

        const snapshotName = `snapshot-${formatDate(new Date(), 'onlyDateFileName')}.txt`
        const objectsPath = `${backupPath}objects/` as `${string}/`

        backup(
            mikroORMConfig[process.env.NODE_ENV].dbName!, 
            snapshotName, 
            objectsPath
        )
    }

    /**
     * Restore the database from a snapshot file.
     * @param snapshotDate Date of the snapshot to restore
     * @returns 
     */
    async restore(snapshotDate: string) {

        const backupPath = databaseConfig.backup.path
        if (!backupPath) return console.log('Backup path not set, couldn\'t restore')

        try {

            restore(
                mikroORMConfig[process.env.NODE_ENV].dbName!,
                `${backupPath}snapshot-${snapshotDate}.txt`,
            )

        } catch (error) {
            this.logger.log('error', 'Snapshot file not found, couldn\'t restore')
        }
    }

}