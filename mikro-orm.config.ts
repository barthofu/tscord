import { mikroORMConfig } from "./src/configs/database"
import * as entities from "@entities"
import { PluginsManager } from "@services"
import { Options } from "@mikro-orm/core"
import { resolveDependency } from "@utils/functions"

export default async () => {
    const pluginsManager = await resolveDependency(PluginsManager)
    await pluginsManager.loadPlugins()

    return {
        ...mikroORMConfig[process.env.NODE_ENV || 'development'] as Options<DatabaseDriver>,
        entities: [...Object.values(entities), ...pluginsManager.getEntities()]
    }
}

