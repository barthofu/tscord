import { delay, inject, singleton } from 'tsyringe'
import { EntityManager, EntityName, MikroORM } from '@mikro-orm/core'
import { backup, restore } from 'saveqlite'
import fs from 'fs'

import { Schedule } from '@decorators'
import { Logger } from '@services'

import { databaseConfig, mikroORMConfig } from '@config'

@singleton()
export class Database {

    constructor(
        @inject(delay(() => Logger)) private logger: Logger
    ) { }

    private _orm: MikroORM

    public async initialize() {

        // initialize the ORM using the configuration exported in `mikro-orm.config.ts`
        this._orm = await MikroORM.init()

        const migrator = this._orm.getMigrator()

        // create migration if no one is present in the migrations folder
        const pendingMigrations = await migrator.getPendingMigrations()
        const executedMigrations = await migrator.getExecutedMigrations()
        if (pendingMigrations.length === 0 && executedMigrations.length === 0) {
            await migrator.createInitialMigration()
        }

        // migrate to the latest migration
        await this._orm.getMigrator().up()
    }

    public async refreshConnection() {
        await this.orm.close()
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
    
    /**
     * Create a snapshot of the database each day at 23:59:59
     */
    @Schedule('59 59 23 * * *')
    async backup(snapshotName?: string): Promise<boolean> { 

        const { formatDate } = await import('@utils/functions') 
        
        if (!databaseConfig.backup.enabled && !snapshotName) return false
        if (!this.isSQLiteDatabase()) {
            this.logger.log('error', 'Database is not SQLite, couldn\'t backup')
            return false
        }

        const backupPath = databaseConfig.backup.path
        if (!backupPath) {
            this.logger.log('error', 'Backup path not set, couldn\'t backup', true)
            return false
        }

        if (!snapshotName) snapshotName = `snapshot-${formatDate(new Date(), 'onlyDateFileName')}`
        const objectsPath = `${backupPath}objects/` as `${string}/`

        try {

            await backup(
                mikroORMConfig[process.env.NODE_ENV]!.dbName!, 
                snapshotName + '.txt', 
                objectsPath
            )

            return true

        } catch(e) {

            const errorMessage = typeof e === 'string' ? e : e instanceof Error ? e.message : 'Unknown error'

            this.logger.log('error', 'Couldn\'t backup : ' + errorMessage, true)
            return false
        }

    }

    /**
     * Restore the SQLite database from a snapshot file.
     * @param snapshotDate Date of the snapshot to restore
     * @returns 
     */
    async restore(snapshotName: string): Promise<boolean> {

        if (!this.isSQLiteDatabase()) {
            this.logger.log('error', 'Database is not SQLite, couldn\'t restore')
            return false
        }

        const backupPath = databaseConfig.backup.path
        if (!backupPath) {
            this.logger.log('error', 'Backup path not set, couldn\'t restore', true)
        }
        
        try {

            await restore(
                mikroORMConfig[process.env.NODE_ENV]!.dbName!,
                `${backupPath}${snapshotName}.txt`,
            )

            await this.refreshConnection()

            return true

        } catch (error) {
            this.logger.log('error', 'Snapshot file not found, couldn\'t restore', true)
            return false
        }
    }

    getBackupList(): string[] | null {

        const backupPath = databaseConfig.backup.path
        if (!backupPath) {
            this.logger.log('error', 'Backup path not set, couldn\'t get list of backups')
            return null
        }

        const files = fs.readdirSync(backupPath)
        const backupList = files.filter(file => file.startsWith('snapshot'))

        return backupList
    }

    private isSQLiteDatabase() {
        return mikroORMConfig[process.env.NODE_ENV]!.type === 'sqlite'
    }

}