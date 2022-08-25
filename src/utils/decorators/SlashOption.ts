import { InvalidOptionName } from "@errors"
import { sanitizeLocales, setOptionsLocalization } from "@utils/functions"
import { constant, of } from "case"
import { SlashOption as SlashOptionX, SlashOptionOptions as SlashOptionOptionsX } from "discordx"

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

    let localizationSource: string | null = null

    if (options.localizationSource) localizationSource = constant(options.localizationSource)
    else if (options.name) localizationSource = constant(options.name)

    if (localizationSource) {

        options = setOptionsLocalization({
            target: 'description',
            options,
            localizationSource: `OPTIONS.${localizationSource}`,
        }) 

        options = setOptionsLocalization({
            target: 'name',
            options,
            localizationSource: `OPTIONS.${localizationSource}`,
        })
    }

    options = sanitizeLocales(options) 

    if (of(options.name) !== 'lower') throw new InvalidOptionName(options.name)

    return SlashOptionX(options as SlashOptionOptionsX)
}
