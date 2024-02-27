import fs from 'node:fs'

import { EntityName, MikroORM, Options } from '@mikro-orm/core'
import fastFolderSizeSync from 'fast-folder-size/sync'
import { backup, restore } from 'saveqlite'
import { delay, inject } from 'tsyringe'

import { databaseConfig, mikroORMConfig } from '@/configs'
import { Schedule, Service } from '@/decorators'
import * as entities from '@/entities'
import { env } from '@/env'
import { Logger, PluginsManager, Store } from '@/services'
import { resolveDependency } from '@/utils/functions'

@Service()
export class Database {

	private _orm: MikroORM<DatabaseDriver>

	constructor(
		@inject(delay(() => Store)) private store: Store,
        @inject(delay(() => Logger)) private logger: Logger
	) {}

	async initialize() {
		const pluginsManager = await resolveDependency(PluginsManager)

		// get config
		const config = mikroORMConfig[env.NODE_ENV || 'development'] as Options<DatabaseDriver>

		// defines entities into the config
		config.entities = [...Object.values(entities), ...pluginsManager.getEntities()]

		// initialize the ORM using the configuration exported in `mikro-orm.config.ts`
		this._orm = await MikroORM.init(config)

		const shouldMigrate = !this.store.get('botHasBeenReloaded')
		if (shouldMigrate) {
			const migrator = this._orm.getMigrator()

			// create migration if no one is present in the migrations folder
			const pendingMigrations = await migrator.getPendingMigrations()
			const executedMigrations = await migrator.getExecutedMigrations()
			if (pendingMigrations.length === 0 && executedMigrations.length === 0)
				await migrator.createInitialMigration()

			// migrate to the latest migration
			await this._orm.getMigrator().up()
		}
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
	get<T extends object>(entity: EntityName<T>) {
		return this._orm.em.getRepository(entity)
	}

	/**
	 * Create a snapshot of the database each day at 00:00
	 */
	@Schedule('0 0 * * *')
	async backup(snapshotName?: string): Promise<boolean> {
		const { formatDate } = await import('@/utils/functions')

		if (!databaseConfig.backup.enabled && !snapshotName)
			return false
		if (!this.isSQLiteDatabase()) {
			this.logger.log('Database is not SQLite, couldn\'t backup')

			return false
		}

		const backupPath = databaseConfig.backup.path
		if (!backupPath) {
			this.logger.log('Backup path not set, couldn\'t backup', 'error', true)

			return false
		}

		if (!snapshotName)
			snapshotName = `snapshot-${formatDate(new Date(), 'onlyDateFileName')}`
		const objectsPath = `${backupPath}objects/` as `${string}/`

		try {
			await backup(
				mikroORMConfig[env.NODE_ENV]!.dbName!,
				`${snapshotName}.txt`,
				objectsPath
			)

			return true
		} catch (e) {
			const errorMessage = typeof e === 'string' ? e : e instanceof Error ? e.message : 'Unknown error'

			this.logger.log(`Couldn't backup : ${errorMessage}`, 'error', true)

			return false
		}
	}

	/**
	 * Restore the SQLite database from a snapshot file.
	 * @param snapshotName name of the snapshot to restore
	 * @returns true if the snapshot has been restored, false otherwise
	 */
	async restore(snapshotName: string): Promise<boolean> {
		if (!this.isSQLiteDatabase()) {
			this.logger.log('Database is not SQLite, couldn\'t restore', 'error')

			return false
		}

		const backupPath = databaseConfig.backup.path
		if (!backupPath)
			this.logger.log('Backup path not set, couldn\'t restore', 'error', true)

		try {
			console.debug(mikroORMConfig[env.NODE_ENV]!.dbName!)
			console.debug(`${backupPath}${snapshotName}`)
			await restore(
				mikroORMConfig[env.NODE_ENV]!.dbName!,
                `${backupPath}${snapshotName}`
			)

			await this.refreshConnection()

			return true
		} catch (error) {
			console.debug(error)
			this.logger.log('Snapshot file not found, couldn\'t restore', 'error', true)

			return false
		}
	}

	getBackupList(): string[] | null {
		const backupPath = databaseConfig.backup.path
		if (!backupPath) {
			this.logger.log('Backup path not set, couldn\'t get list of backups', 'error')

			return null
		}

		const files = fs.readdirSync(backupPath)
		const backupList = files.filter(file => file.startsWith('snapshot'))

		return backupList
	}

	getSize(): DatabaseSize {
		const size: DatabaseSize = {
			db: null,
			backups: null,
		}

		if (this.isSQLiteDatabase()) {
			const dbPath = mikroORMConfig[env.NODE_ENV]!.dbName!
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

	isSQLiteDatabase(): boolean {
		const type = mikroORMConfig[env.NODE_ENV]!.type

		if (type)
			return ['sqlite', 'better-sqlite'].includes(type)
		else return false
	}

}
