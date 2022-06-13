import { Message } from 'discord.js'

import { generalConfig } from '@configs'

/**
 * Get prefix from the database or from the config file.
 * @param message
 */
export const getPrefixFromMessage = (message: Message) => {

    return generalConfig.simpleCommandsPrefix
}