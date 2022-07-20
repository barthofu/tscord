import { CommandInteraction, ContextMenuCommandInteraction } from 'discord.js'
import { ArgsOf, GuardFunction, SimpleCommandMessage } from 'discordx'

import { resolveUser, isInMaintenance, replyToInteraction } from '@utils/functions'
import { getLocaleFromInteraction, L } from '@i18n'

import { generalConfig } from '@config'

/**
 * Prevent interactions from running when bot is in maintenance
 */
export const Maintenance: GuardFunction<
    | ArgsOf<'messageCreate' | 'interactionCreate'>
> = async (arg, client, next) => {

    if (
        arg instanceof CommandInteraction ||
        arg instanceof SimpleCommandMessage ||
        arg instanceof ContextMenuCommandInteraction
    ) {

        const user = resolveUser(arg),
              maintenance = await isInMaintenance()

        if (
            maintenance &&
            user?.id &&
            !generalConfig.devs.includes(user.id)
        ) {

            const locale = getLocaleFromInteraction(arg),
                  localizedReplyMessage = L[locale].GUARDS.MAINTENANCE()
            
            if (arg instanceof CommandInteraction || arg instanceof SimpleCommandMessage) await replyToInteraction(arg, localizedReplyMessage)
        }
        else return next()
    } 
    else return next()
}