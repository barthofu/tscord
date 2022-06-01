import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { CommandInteraction, ContextMenuInteraction } from 'discord.js'

import { getLocaleFromInteraction, L } from '@i18n'
import { resolveUser, replyToInteraction } from '@utils/functions'

import config from '../../config.json'

/**
 * Prevent interaction from running when it is disabled
 */
export const Disabled: GuardFunction<
    | CommandInteraction
    | SimpleCommandMessage
    | ContextMenuInteraction
> = async (arg, client, next) => {

    const user = resolveUser(arg)

    if (user?.id && config.devs.includes(user.id)) {
        return next()
    }
    else {
        if (arg instanceof CommandInteraction || arg instanceof SimpleCommandMessage) {

            const locale = getLocaleFromInteraction(arg),
                  localizedReplyMessage = L[locale].GUARDS.DISABLED_COMMAND()
    
            await replyToInteraction(arg, localizedReplyMessage)
        }
    }
}