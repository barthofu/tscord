import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { ContextMenuCommandInteraction, CommandInteraction as DCommandInteraction, Interaction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, CommandInteraction, SelectMenuInteraction, ButtonInteraction } from 'discord.js'

import { getLocaleFromInteraction, L } from '@i18n'
import { resolveUser, replyToInteraction } from '@utils/functions'

import { generalConfig } from '@config'

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

    await next()
}