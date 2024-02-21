import { SlashChoice as SlashChoiceX } from "discordx"

import { constantPreserveDots, sanitizeLocales, setOptionsLocalization } from "@utils/functions"

/**
 * The slash command option can implement autocompletion for string and number types
 *
 * @param options - choices
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/decorators/commands/slash-choice)
 *
 * @category Decorator
 */
 export const SlashChoice = (...options: string[] | number[] | SlashChoiceOption[]) => {

    for (let i = 0; i < options.length; i++) {

        let option = options[i]

        if (typeof option !== 'number' && typeof option !== 'string') {
        
            let localizationSource: TranslationsNestedPaths | null = null
            if (option.localizationSource) localizationSource = constantPreserveDots(option.localizationSource) as TranslationsNestedPaths
        
            if (localizationSource) {

                option = setOptionsLocalization({
                    target: 'description',
                    options: option,
                    localizationSource,
                }) 
        
                option = setOptionsLocalization({
                    target: 'name',
                    options: option,
                    localizationSource,
                })
            }
        
            options[i] = sanitizeLocales(option) 
        }
    }

    if (typeof options[0] === 'string') return SlashChoiceX(...options as string[])
    else if (typeof options[0] === 'number') return SlashChoiceX(...options as number[])
    else return SlashChoiceX(...options as SlashChoiceOption[])
}
