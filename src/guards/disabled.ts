import { CommandInteraction, ContextMenuCommandInteraction } from "discord.js"
import { GuardFunction, SimpleCommandMessage } from "discordx"

import { getLocaleFromInteraction, L } from "@i18n"
import { isDev, replyToInteraction, resolveUser } from "@utils/functions"

/**
 * Prevent interaction from running when it is disabled
 */
export const Disabled: GuardFunction<
    | CommandInteraction
    | SimpleCommandMessage
    | ContextMenuCommandInteraction
> = async (arg, client, next) => {

    const user = resolveUser(arg)

    if (user?.id && isDev(user.id)) {
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