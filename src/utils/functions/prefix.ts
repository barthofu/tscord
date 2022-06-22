import { Message } from 'discord.js'

import { generalConfig } from '@config'
import { container } from 'tsyringe'
import { Database } from '@services'
import { Guild } from '@entities'

/**
 * Get prefix from the database or from the config file.
 * @param message
 */
export const getPrefixFromMessage = async (message: Message) => {

    const guildRepo = container.resolve(Database).getRepo(Guild)

    const guildId = message.guild?.id
    const guildData = await guildRepo.findOne({ id: guildId })

    return guildData?.prefix || generalConfig.simpleCommandsPrefix
}