import { ApplicationCommandOptions as ApplicationCommandOptionsX, Slash as SlashX } from 'discordx'
import { Locale } from 'discord-api-types/v9'
import { constant } from 'case'

import { Translation } from '@i18n'
import { generalConfig } from '@config'
import { getCallerFile, getLocalizedCommandInfo } from '@utils/functions'

enum AdditionnalLocaleString {
    English = 'en'
}

type LocalizationMap = Partial<Record<`${Locale | AdditionnalLocaleString}`, string>>

type ApplicationCommandOptions = Modify<ApplicationCommandOptionsX, {
    descriptionLocalizations?: LocalizationMap
    nameLocalizations?: LocalizationMap
    localizationSource?: keyof Translation['COMMANDS']
}>

/**
 * Handle a slash command
 * @param options - slash options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 *
 * @category Decorator
 */
export const Slash = (options: ApplicationCommandOptions) => {

    defineLocalizationStrategy(options, 'description')
    defineLocalizationStrategy(options, 'name')

    // convert 'en' localizations to 'en-US' and 'en-GB'
    if (options?.nameLocalizations?.['en']) {
        options.nameLocalizations['en-US'] = options.nameLocalizations['en']
        options.nameLocalizations['en-GB'] = options.nameLocalizations['en']
        delete options.nameLocalizations['en']
    }
    if (options?.descriptionLocalizations?.['en']) {
        options.descriptionLocalizations['en-US'] = options.descriptionLocalizations['en']
        options.descriptionLocalizations['en-GB'] = options.descriptionLocalizations['en']
        delete options.descriptionLocalizations['en']
    }

    console.debug(options)
    
    return SlashX(options)
}

const defineLocalizationStrategy = (options: ApplicationCommandOptions, target: 'name' | 'description') => {

    let localizationSource: string | null = null
    const commandNameFromFile = getCallerFile(2)?.split('/').pop()?.split('.')[0]

    if (options.localizationSource) localizationSource = constant(options.localizationSource)
    else if (options.name) localizationSource = constant(options.name)
    else if (commandNameFromFile) localizationSource = constant(commandNameFromFile)

    if (!localizationSource) return

    if (!options[`${target}Localizations`]) {
        options[`${target}Localizations`] = getLocalizedCommandInfo(target.toUpperCase() as 'NAME' | 'DESCRIPTION', localizationSource)
    }
    
    if (!options[target]) 
        options[target] = 
            getLocalizedCommandInfo(target.toUpperCase() as 'NAME' | 'DESCRIPTION', localizationSource)[generalConfig.defaultLocale]
            || (target === 'name' ? commandNameFromFile : undefined)
}