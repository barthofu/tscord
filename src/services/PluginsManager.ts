import { ImportLocaleMapping, storeTranslationsToDisk  } from "typesafe-i18n/importer";
import { resolve } from "@discordx/importer";
import { singleton } from "tsyringe";

import { BaseController, Plugin } from "@utils/classes";
import { BaseTranslation } from "typesafe-i18n";
import { defaultTranslations } from "@i18n";
import { AnyEntity, EntityClass } from "@mikro-orm/core";

@singleton()
export class PluginsManager {
    private plugins: Plugin[] = [];

    constructor() {}

    public async loadPlugins(): Promise<void> {
        const pluginPaths = resolve(process.env.PWD + "/plugins/*");
        for (const path of pluginPaths) {
            const plugin = new Plugin(path);
            await plugin.load();

            if(plugin.isValid()) this.plugins.push(plugin);
        }
    }

    public getEntities(): EntityClass<AnyEntity>[] {
        return this.plugins.map(plugin => Object.values(plugin.entities)).flat()
    }

    public getControllers(): typeof BaseController[] {
        return this.plugins.map(plugin => Object.values(plugin.controllers)).flat()
    }

    public async importCommands(): Promise<void> {
        for (const plugin of this.plugins) await plugin.importCommands();
    }

    public async importEvents(): Promise<void> {
        for (const plugin of this.plugins) await plugin.importEvents();
    }

    public async initServices(): Promise<{ [key: string]: any }> {
        let services: { [key: string]: any } = {};

        for (const plugin of this.plugins) {
            for(const service in plugin.services) {
                services[service] = new plugin.services[service]();
            }
        }

        return services;
    }

    public async syncTranslations(saveToDisk: boolean = true, generateTypes?: boolean): Promise<void> {
        let localeMapping: ImportLocaleMapping[] =  [];
        let namespaces: { [key: string]: string[] } = {};
        let translations: { [key: string]: BaseTranslation } = { ...defaultTranslations };

        for (const plugin of this.plugins) {
            for (const locale in plugin.translations) {
                if(!translations[locale]) translations[locale] = {};
                if(!namespaces[locale]) namespaces[locale] = [];

                translations[locale] = { ...translations[locale], [plugin.name]: plugin.translations[locale] }
                namespaces[locale].push(plugin.name);
            }
        }

        for(let locale in translations) {
            if(!Object.keys(defaultTranslations).includes(locale)) continue
            localeMapping.push({
                locale,
                translations: translations[locale],
                namespaces: namespaces[locale]
            });
        }
    
        if(saveToDisk) await storeTranslationsToDisk(localeMapping, generateTypes);
    }
}