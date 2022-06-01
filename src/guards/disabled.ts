import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { CommandInteraction, ContextMenuInteraction } from 'discord.js'

import { resolveUser } from '@utils/functions'

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
        if (arg instanceof CommandInteraction) arg.reply('This command is disabled.')
        else if (arg instanceof SimpleCommandMessage) arg.message.reply('This command is disabled.')
    }

}