import { Message } from 'discord.js'

import { resolveDependency } from "@utils/functions"
import { generalConfig } from '@config'
import { Database } from '@services'
import { Guild } from '@entities'

/**
 * Get prefix from the database or from the config file.
 * @param message
 */
export const getPrefixFromMessage = async (message: Message) => {
    const db = await resolveDependency(Database)
    const guildRepo = db.get(Guild)

    const guildId = message.guild?.id
    const guildData = await guildRepo.findOne({ id: guildId })

    return guildData?.prefix || generalConfig.simpleCommandsPrefix
}