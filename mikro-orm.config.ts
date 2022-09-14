import { mikroORMConfig } from './src/config/database'
import * as entities from '@entities'
import { getPluginsEntities } from '@utils/functions'
import { Options } from '@mikro-orm/core'

export default async () => {
    let config = mikroORMConfig[process.env.NODE_ENV || 'development'] as Options<DatabaseDriver>

    config.entities = [...Object.values(entities), ...Object.values(await getPluginsEntities())]

    return config
}

