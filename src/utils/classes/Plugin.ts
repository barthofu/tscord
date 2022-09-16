import { importx, resolve } from "@discordx/importer";
import { AnyEntity, EntityClass } from "@mikro-orm/core";
import { BaseController } from "@utils/classes";
import { BaseTranslation } from "typesafe-i18n";

export class Plugin {
    // Common values
    private _path: string;
    private _name: string;
    private _version: string;

    // Specific values
    private _entities: { [key: string]: EntityClass<AnyEntity> };
    private _controllers: { [key: string]: typeof BaseController };
    private _translations: { [key: string]: BaseTranslation };

    constructor(path: string) {
        this._path = path;
    }

    public async load(): Promise<void> {
        // Read plugin.json
        const pluginConfig = await import(this._path + "/plugin.json");

        // Assign common values
        this._name = pluginConfig.name;
        this._version = pluginConfig.version;

        // Load specific values
        this._entities = await this.getEntities();
        this._controllers = await this.getControllers();
        this._translations = await this.getTranslations();


    }

    private async getControllers(): Promise<{ [key: string]: typeof BaseController }> {
        return import(this._path + "/api/controllers");
    }
    
    private async getEntities(): Promise<{ [key: string]: EntityClass<AnyEntity> }> { 
        return import(this._path + "/entities");
    }

    private async getTranslations(): Promise<{ [key: string]: BaseTranslation }> {
        const translations: { [key: string]: BaseTranslation } = {};

        const localesPath = resolve(this._path + "/i18n/*.{ts,js}");
        for(const localeFile of localesPath) {
            const locale = localeFile.split("/").at(-1)?.split(".")[0] || "unknow";
            translations[locale] = (await import(localeFile)).default;
        }

        return translations;
    }

    public async importCommands(): Promise<void> {
        await importx(this._path + "/commands/**/*.{ts,js}");
    }

    public async importEvents(): Promise<void> {
        await importx(this._path + "/events/**/*.{ts,js}");
    }

    get path() { return this._path }
    get name() { return this._name }
    get version() { return this._version }
    get entities() { return this._entities }
    get controllers() { return this._controllers }
    get translations() { return this._translations }
}