type DatabaseSize = {
	db: number | null
	backups: number | null
}

type DatabaseDriver = import('@mikro-orm/sqlite').SqliteDriver
type DatabaseEntityManager = import('@mikro-orm/sqlite').SqlEntityManager