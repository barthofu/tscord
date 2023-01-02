import { resolve } from "@discordx/importer"
import { AnyEntity, EntityClass } from "@mikro-orm/core"
import fs from "fs"
import { singleton } from "tsyringe"
import { BaseTranslation } from "typesafe-i18n"
import { ImportLocaleMapping, storeTranslationsToDisk } from "typesafe-i18n/importer"

import { locales } from "@i18n"
import { BaseController, Plugin } from "@utils/classes"
import { getSourceCodeLocation } from "@utils/functions"
import { Store } from "@services"

@singleton()
export class PluginsManager {

    private _plugins: Plugin[] = []

    constructor(
        private store: Store
    ) {}

    public async loadPlugins(): Promise<void> {

        const pluginPaths = resolve(`${getSourceCodeLocation()}/plugins/*`)

        for (const path of pluginPaths) {

            const plugin = new Plugin(path)
            await plugin.load()

            if (plugin.isValid()) this.plugins.push(plugin)
        }
    }

    public getEntities(): EntityClass<AnyEntity>[] {
        return this._plugins.map(plugin => Object.values(plugin.entities)).flat()
    }

    public getControllers(): typeof BaseController[] {
        return this._plugins.map(plugin => Object.values(plugin.controllers)).flat()
    }

    public async importCommands(): Promise<void> {
        for (const plugin of this._plugins) await plugin.importCommands()
    }

    public async importEvents(): Promise<void> {
        for (const plugin of this._plugins) await plugin.importEvents()
    }

    public async initServices(): Promise<{ [key: string]: any }> {

        let services: { [key: string]: any } = {}

        for (const plugin of this._plugins) {

            for (const service in plugin.services) {
                
                services[service] = new plugin.services[service]()
            }
        }

        return services
    }

    public async execMains(): Promise<void> {

        for (const plugin of this._plugins) {
            await plugin.execMain()
        }
    }

    public async syncTranslations(): Promise<void> {

        let localeMapping: ImportLocaleMapping[] =  []
        let namespaces: { [key: string]: string[] } = {}
        let translations: { [key: string]: BaseTranslation } = {}

        for (const locale of locales) {
            const path = getSourceCodeLocation() + '/i18n/' + locale
            if (fs.existsSync(path)) translations[locale] = (await import(path))?.default
        }

        for (const plugin of this._plugins) {

            for (const locale in plugin.translations) {
                
                if (!translations[locale]) translations[locale] = {}
                if (!namespaces[locale]) namespaces[locale] = []

                translations[locale] = { ...translations[locale], [plugin.name]: plugin.translations[locale] }
                namespaces[locale].push(plugin.name)
            }
        }

        for (const locale in translations) {

            if (!locales.includes(locale as any)) continue

            localeMapping.push({
                locale,
                translations: translations[locale],
                namespaces: namespaces[locale]
            })
        }

        const pluginsName = this._plugins.map(plugin => plugin.name)

        for (const path of await resolve(getSourceCodeLocation() + '/i18n/*/*/index.ts')) {

            const name = path.split("/").at(-2) || ""
            
            if (!pluginsName.includes(name)) {
                await fs.rmSync(path.slice(0, -8), { recursive: true, force: true })
            }
        }

        await storeTranslationsToDisk(localeMapping, true)
    }

    public isPluginLoad(pluginName: string): boolean {
        return this._plugins.findIndex(plugin => plugin.name === pluginName) !== -1
    }

    get plugins() { return this._plugins }
}