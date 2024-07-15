import 'reflect-metadata'

import { defineConfig, Options } from '@mikro-orm/core'

import entities from '@/entities'
import { env } from '@/env'
import { PluginsManager } from '@/services'
import { resolveDependency } from '@/utils/functions'

import { mikroORMConfig } from './configs/database.js'

export default async () => {
	const pluginsManager = await resolveDependency(PluginsManager)
	await pluginsManager.loadPlugins()

	return defineConfig({
		...mikroORMConfig[env.NODE_ENV] as Options<DatabaseDriver>,
		entities: [...Object.values(entities), ...pluginsManager.getEntities()],
	})
}
