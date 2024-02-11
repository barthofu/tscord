// @ts-nocheck

import { Options } from '@mikro-orm/core'

import * as entities from '@/entities'
import { env } from '@/env'
import { PluginsManager } from '@/services'
import { resolveDependency } from '@/utils/functions'

import { mikroORMConfig } from './src/configs/database'

export default async () => {
	const pluginsManager = await resolveDependency(PluginsManager)
	await pluginsManager.loadPlugins()

	return {
		...mikroORMConfig[env.NODE_ENV || 'development'] as Options<DatabaseDriver>,
		entities: [...Object.values(entities), ...pluginsManager.getEntities()],
	}
}
