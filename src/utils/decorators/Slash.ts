import { Slash as SlashX } from 'discordx'
import { constant } from 'case'

import { constantPreserveDots, getCallerFile, sanitizeLocales, setOptionsLocalization } from '@utils/functions'

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

    let localizationSource: TranslationsNestedPaths | null = null
    const commandNameFromFile = getCallerFile(1)?.split('/').pop()?.split('.')[0]

    if (options.localizationSource) localizationSource = constantPreserveDots(options.localizationSource) as TranslationsNestedPaths
    else if (options.name) localizationSource = 'COMMANDS.' + constantPreserveDots(options.name) as TranslationsNestedPaths
    else if (commandNameFromFile) localizationSource = 'COMMANDS.' + constantPreserveDots(commandNameFromFile) as TranslationsNestedPaths

    if (localizationSource) {
        
        options = setOptionsLocalization({
            target: 'description',
            options, 
            localizationSource,
            nameFallback: commandNameFromFile
        })

        options = setOptionsLocalization({
            target: 'name',
            options, 
            localizationSource,
            nameFallback: commandNameFromFile
        })
    } 

    options = sanitizeLocales(options)

    return SlashX(options)
}
