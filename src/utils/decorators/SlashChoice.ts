import { sanitizeLocales } from "@utils/functions"
import { SlashChoice as SlashChoiceX } from "discordx"

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
        const option = options[i]
        if (typeof option !== 'number' && typeof option !== 'string') options[i] = sanitizeLocales(option) 
    }

    if (typeof options[0] === 'string') return SlashChoiceX(...options as string[])
    else if (typeof options[0] === 'number') return SlashChoiceX(...options as number[])
    else return SlashChoiceX(...options as SlashChoiceOption[])
}
