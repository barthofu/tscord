import { constant } from "case"

import { loadedLocales, Translation } from "@i18n"
import { getCallerFile } from "@utils/functions"
import { generalConfig } from "@config"

export const getLocalizedCommandDescription = (commandSource: keyof Translation['COMMANDS']) => getLocalizedCommandInfo('DESCRIPTION', commandSource)
export const getLocalizedCommandName = (commandSource: keyof Translation['COMMANDS']) => getLocalizedCommandInfo('NAME', commandSource)

export const getLocalizedCommandInfo = (target: 'NAME' | 'DESCRIPTION', commandSource: string) => {

    const localizations = Object.fromEntries(
        Object
            .entries(loadedLocales)
            .map(([currLocale, localeObj]) => {
                // @ts-ignore   
                const hasLocalization = localeObj['COMMANDS'][commandSource]?.[target]
                return [currLocale, hasLocalization]
            })
            .filter(([_, hasLocalization]) => hasLocalization)
    )

    return localizations !== {} ? localizations : null
}

export const setOptionsLocalization = <K extends SanitizedOptions & { name?: string }>({ options, target, localizationSource, nameFallback }: {
    options: K, 
    target: 'name' | 'description',
    localizationSource: string,
    nameFallback?: string
}) => {

    if (!options[`${target}Localizations`]) {
        options[`${target}Localizations`] = getLocalizedCommandInfo(target.toUpperCase() as 'NAME' | 'DESCRIPTION', localizationSource)
    }
    
    if (!options[target as keyof typeof options]) {
        options[target as keyof typeof options] = 
            getLocalizedCommandInfo(target.toUpperCase() as 'NAME' | 'DESCRIPTION', localizationSource)[generalConfig.defaultLocale]
            || (target === 'name' ? nameFallback : undefined)
    }

    return options
}

export const sanitizeLocales = <K extends SanitizedOptions>(option: K) => {
    
    // convert 'en' localizations to 'en-US' and 'en-GB'
    if (option?.nameLocalizations?.['en']) {
        option.nameLocalizations['en-US'] = option.nameLocalizations['en']
        option.nameLocalizations['en-GB'] = option.nameLocalizations['en']
        delete option.nameLocalizations['en']
    }
    if (option?.descriptionLocalizations?.['en']) {
        option.descriptionLocalizations['en-US'] = option.descriptionLocalizations['en']
        option.descriptionLocalizations['en-GB'] = option.descriptionLocalizations['en']
        delete option.descriptionLocalizations['en']
    }

    return option
}