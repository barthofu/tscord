import { Message } from "discord.js"

import { generalConfig } from "@config"
import { Guild } from "@entities"
import { Database } from "@services"
import { resolveDependency } from "@utils/functions"

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