import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { CommandInteraction, ContextMenuInteraction } from 'discord.js'

import { resolveUser } from '@utils/functions'

import config from '../../config.json'

export const disabled: GuardFunction<
    | CommandInteraction
    | SimpleCommandMessage
    | ContextMenuInteraction
> = async (interaction: CommandInteraction | SimpleCommandMessage | ContextMenuInteraction, _, next) => {

    const user = resolveUser(interaction)

    if (user?.id && config.devs.includes(user.id)) {
        return next()
    }
    else {
        if (interaction instanceof CommandInteraction) interaction.reply('This command is disabled.')
        else if (interaction instanceof SimpleCommandMessage) interaction.message.reply('This command is disabled.')
    }

}