import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction, Interaction, SelectMenuInteraction } from "discord.js"
import { GuardFunction, SimpleCommandMessage } from "discordx"

import { getLocaleFromInteraction, L } from "@i18n"

/**
 * Extract locale from any interaction and pass it as guard data
 */
export const ExtractLocale: GuardFunction<Interaction> = async (interaction, client, next, guardData) => {

    if (
        interaction instanceof SimpleCommandMessage
        || interaction instanceof CommandInteraction
        || interaction instanceof ContextMenuCommandInteraction
        || interaction instanceof SelectMenuInteraction
        || interaction instanceof ButtonInteraction
    ) {

        const sanitizedLocale = getLocaleFromInteraction(interaction as AllInteractions)

        guardData.sanitizedLocale = sanitizedLocale
        guardData.localize = L[sanitizedLocale]
    }

    await next(guardData)
}