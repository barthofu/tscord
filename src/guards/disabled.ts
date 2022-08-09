import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { ContextMenuCommandInteraction, CommandInteraction } from 'discord.js'

import { getLocaleFromInteraction, L } from '@i18n'
import { resolveUser, replyToInteraction } from '@utils/functions'

import { generalConfig } from '@config'

/**
 * Prevent interaction from running when it is disabled
 */
export const Disabled: GuardFunction<
    | CommandInteraction
    | SimpleCommandMessage
    | ContextMenuCommandInteraction
> = async (arg, client, next) => {

    const user = resolveUser(arg)

    if (user?.id && generalConfig.devs.includes(user.id)) {
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