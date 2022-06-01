import { CommandInteraction, ContextMenuInteraction } from 'discord.js'
import { ArgsOf, GuardFunction, SimpleCommandMessage } from 'discordx'

import { resolveUser, isInMaintenance } from '@utils/functions'
import { getLocaleFromInteraction, L } from '@i18n'

import config from '../../config.json'
import { replyToInteraction } from '@utils/functions/interactions'

/**
 * Prevent interactions from running when bot is in maintenance
 */
export const Maintenance: GuardFunction<
    | ArgsOf<'messageCreate' | 'interactionCreate'>
> = async ([arg], client, next) => {

    if (
        arg instanceof CommandInteraction ||
        arg instanceof SimpleCommandMessage ||
        arg instanceof ContextMenuInteraction
    ) {

        const user = resolveUser(arg),
              maintenance = await isInMaintenance()

        if (
            maintenance &&
            user?.id &&
            !config.devs.includes(user.id)
        ) {

            const locale = getLocaleFromInteraction(arg),
                  localizedReplyMessage = L[locale].GUARDS.MAINTENANCE()
            
            if (arg instanceof CommandInteraction || arg instanceof SimpleCommandMessage) await replyToInteraction(arg, localizedReplyMessage)
        }
        else return next()
    } 
    else return next()
}