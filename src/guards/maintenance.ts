import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, SelectMenuInteraction } from 'discord.js'
import { container } from 'tsyringe'

import { Client } from '@core/Client'
import { resolveUser } from '@utils/functions'

import config from '../../config.json'

const isMaintenance = false

export const maintenance: GuardFunction<
    | CommandInteraction
    | ContextMenuInteraction
    | SelectMenuInteraction
    | ButtonInteraction
    | SimpleCommandMessage
> = async (rawArg, _, next) => {
    
    const arg = rawArg instanceof Array ? rawArg[0] : rawArg,
          user = resolveUser(arg)

    const client = container.resolve(Client)
    const isMaintenance = await client.isInMaintenance()

    if (!(
        ['CommandInteraction', 'ContextMenuInteraction', 'SelectMenuInteraction', 'ButtonInteraction'].includes(arg.constructor.name)
        && isMaintenance
        && user?.id
        && !config.devs.includes(user.id)
    )) {

        await next()
    }
}