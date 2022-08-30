import { loadedLocales, locales } from "@i18n"
import type { Locales } from "@i18n"
import { generalConfig } from "@config"

export const getLocalizedInfo = (target: 'NAME' | 'DESCRIPTION', localizationSource: TranslationsNestedPaths) => {

    const localizations = Object.fromEntries(
        locales
            .map(locale => [locale, getLocalizationFromPathString(localizationSource + '.' + target as TranslationsNestedPaths, locale)])
            .filter(([_, value]) => value)
    )

    return Object.keys(localizations).length > 0 ? localizations : undefined
}

export const setOptionsLocalization = <K extends SanitizedOptions & { name?: string }>({ options, target, localizationSource, nameFallback }: {
    options: K, 
    target: 'name' | 'description',
    localizationSource: TranslationsNestedPaths,
    nameFallback?: string
}) => {

    if (!options[`${target}Localizations`]) {
        options[`${target}Localizations`] = getLocalizedInfo(target.toUpperCase() as 'NAME' | 'DESCRIPTION', localizationSource)
    }
    
    if (!options[target as keyof typeof options]) {
        options[target as keyof typeof options] = 
            getLocalizedInfo(target.toUpperCase() as 'NAME' | 'DESCRIPTION', localizationSource)?.[generalConfig.defaultLocale]
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

export const getLocalizationFromPathString = (path: TranslationsNestedPaths, locale?: Locales) => {

    const pathArray = path.split('.')
    let currentLocalization: any = loadedLocales[locale ?? generalConfig.defaultLocale]

    for (const pathNode of pathArray) {
        currentLocalization = currentLocalization[pathNode as keyof typeof currentLocalization]
        if (!currentLocalization) return undefined
    }

    return currentLocalization
}