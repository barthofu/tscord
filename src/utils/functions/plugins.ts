import { importx, resolve } from "@discordx/importer";
import { defaultTranslations } from "@i18n";
import { AnyEntity, EntityClass } from "@mikro-orm/core";
import { BaseController } from "@utils/classes";
import { BaseTranslation } from "typesafe-i18n";
import { ImportLocaleMapping, storeTranslationsToDisk } from "typesafe-i18n/importer";

export async function getPluginsControllers(): Promise<{ [key: string]: typeof BaseController }> {
    let controllers = {};
    const controllersExporter = (await getValidPlugins()).map(e => e + "/api/controllers");
    
    for(let exporter of controllersExporter) {
        controllers = {
            ...controllers,
            ...await import(exporter)
        };
    }

    return controllers;
}

export async function getPluginsEntities(): Promise<{ [key: string]: EntityClass<AnyEntity<any>> }> {
    let entities = {};
    const entitiesExporter = (await getValidPlugins()).map(e => e + "/entities");
    
    for(let exporter of entitiesExporter) {
        entities = {
            ...entities,
            ...await import(exporter)
        };
    }

    return entities;
}

export async function importPluginsCommands(): Promise<void> {
    const commands = (await getValidPlugins()).map(e => e + "/commands/**/*.{ts,js}");
    return importx(...commands);
}

export async function importPluginsEvents(): Promise<void> {
    const events = (await getValidPlugins()).map(e => e + "/events/**/*.{ts,js}");
    return importx(...events);
}

export async function importPluginsTranslations(): Promise<void> {
    let localeMapping: ImportLocaleMapping[] =  [];
    let namespaces: { [key: string]: string[] } = {};
    let translations: { [key: string]: BaseTranslation } = { ...defaultTranslations };

    const translationsGlobs = (await getValidPlugins()).map(e => e + "/i18n/*.{ts,js}");
    for(let glob of translationsGlobs) {
        const resolvedTranslations = await resolve(glob);

        for(let resolved of resolvedTranslations) {
            const locale = resolved.split("/").at(-1)?.split(".")[0] || "";
            const namespace = resolved.split("/").at(-3) || "";
            const translation = (await import(resolved)).default as BaseTranslation;

            if(!translations[locale]) translations[locale] = {};
            if(!namespaces[locale]) namespaces[locale] = [];

            namespaces[locale].push(namespace);
            translations[locale] = {
                ...translations[locale],
                [namespace]: translation
            }
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

    await storeTranslationsToDisk(localeMapping);
}

/*
export async function importPluginsTranslations(): Promise<any> {
    let localeMapping: ImportLocaleMapping[] =  [];
    const defaultLocales = Object.keys(defaultTranslations);

    for (const locale of defaultLocales) {
        localeMapping.push({
            locale,
            translations: defaultTranslations[locale as keyof typeof defaultTranslations]
        });
    }

    const translationsGlobs = (await getValidPlugins()).map(e => e + "/i18n/*.{ts,js}");
    for(let glob of translationsGlobs) {
        const resolvedTranslations = await resolve(glob);

        for(let resolved of resolvedTranslations) {
            const locale = resolved.split("/").at(-1)?.split(".")[0] || "";
            const namespace = resolved.split("/").at(-3) || "";
            const translation = (await import(resolved)).default as BaseTranslation;

            if(!defaultLocales.includes(locale)) continue;

            localeMapping.push({
                locale,
                translations: translation,
                namespaces: [namespace]
            });
        }
    }

    return storeTranslationsToDisk(localeMapping);
}
*/

async function getValidPlugins() {
    return resolve(process.env.PWD + "/plugins/*")
}