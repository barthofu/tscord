import { Options } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

import * as entities from '@entities'

const config: Options = {
	type: 'sqlite',
	dbName: './database/db.sqlite',
	entities: Object.values(entities),
	highlighter: new SqlHighlighter(),
	allowGlobalContext: true,
	debug: true,
	migrations: {
		path: './database/migrations',
		emit: 'ts',
		snapshot: true
	}
}

export default config
