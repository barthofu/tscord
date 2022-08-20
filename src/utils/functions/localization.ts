import { loadedLocales, Translation } from "@i18n"

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