import fastFolderSizeSync from 'fast-folder-size/sync'
import { delay, inject, singleton } from 'tsyringe'
import { backup, restore } from 'saveqlite'
import fs from 'fs'

import { EntityName, MikroORM, Options } from '@mikro-orm/core'

import { databaseConfig, mikroORMConfig } from '@config'
import { Schedule } from '@decorators'
import { Logger } from '@services'

@singleton()
export class Database {

    private _orm: MikroORM<DatabaseDriver>

    constructor(
        @inject(delay(() => Logger)) private logger: Logger
    ) { }

    async initialize() {

        // initialize the ORM using the configuration exported in `mikro-orm.config.ts`
        this._orm = await MikroORM.init(mikroORMConfig[process.env.NODE_ENV || 'development'] as Options<DatabaseDriver>)

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

    async refreshConnection() {
        await this._orm.close()
        this._orm = await MikroORM.init()
    }

    get orm(): MikroORM<DatabaseDriver> {
        return this._orm
    }

    get em(): DatabaseEntityManager {
        return this._orm.em
    }

    /**
     * Shorthand to get custom and natives repositories
     * @param entity Entity of the custom repository to get
     */
    getRepo<T>(entity: EntityName<T>) {
        return this._orm.em.getRepository(entity)
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
                `${backupPath}${snapshotName}`,
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

    getSize(): DatabaseSize {

        const size: DatabaseSize = {
            db: null,
            backups: null
        }

        if (this.isSQLiteDatabase()) {

            const dbPath = mikroORMConfig[process.env.NODE_ENV]!.dbName!
            const dbSize = fs.statSync(dbPath).size

            size.db = dbSize
        }

        const backupPath = databaseConfig.backup.path
        if (backupPath) {

            const backupSize = fastFolderSizeSync(backupPath)

            size.backups = backupSize || null
        }

        return size
    }

    isSQLiteDatabase() {
        return mikroORMConfig[process.env.NODE_ENV]!.type === 'sqlite'
    }

}