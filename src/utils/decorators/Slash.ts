import { Slash as SlashX } from 'discordx'
import { constant } from 'case'

import { getCallerFile, sanitizeLocales, setOptionsLocalization } from '@utils/functions'

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

    let localizationSource: string | null = null
    const commandNameFromFile = getCallerFile(1)?.split('/').pop()?.split('.')[0]

    if (options.localizationSource) localizationSource = constant(options.localizationSource)
    else if (options.name) localizationSource = constant(options.name)
    else if (commandNameFromFile) localizationSource = constant(commandNameFromFile)

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

    console.debug(options)
        
    return SlashX(options)
}
