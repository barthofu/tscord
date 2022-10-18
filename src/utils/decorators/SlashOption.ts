import { of } from "case"
import { SlashOption as SlashOptionX, SlashOptionOptions as SlashOptionOptionsX, VerifyName } from "discordx"

import { InvalidOptionName } from "@errors"
import { constantPreserveDots, sanitizeLocales, setOptionsLocalization } from "@utils/functions"

/**
 * Add a slash command option
 *
 * @param options - Slash option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/decorators/commands/slash-option)
 *
 * @category Decorator
 */
 export const SlashOption = (options: SlashOptionOptions) => {

    let localizationSource: TranslationsNestedPaths | null = null

    if (options.localizationSource) localizationSource = constantPreserveDots(options.localizationSource) as TranslationsNestedPaths

    if (localizationSource) {

        options = setOptionsLocalization({
            target: 'description',
            options,
            localizationSource,
        }) 

        options = setOptionsLocalization({
            target: 'name',
            options,
            localizationSource,
        })
    }

    options = sanitizeLocales(options) 

    if (!isValidOptionName(options.name)) throw new InvalidOptionName(options.name)
    if (options.nameLocalizations) {
        for (const name of Object.values(options.nameLocalizations)) {
            if (!isValidOptionName(name)) throw new InvalidOptionName(name)
        }
    }

    if (!options.description) options.description = 'No description provided'

    return SlashOptionX(options as SlashOptionOptionsX<VerifyName<string>, string>)
}

const isValidOptionName = (name: string) => {
    return ['lower', 'snake'].includes(of(name)) && !name.includes(' ') 
}