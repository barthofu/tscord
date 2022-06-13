import { Message } from 'discord.js'

import { generalConfig } from '@configs'

export const getPrefixFromMessage = (message: Message) => {

    return generalConfig.simpleCommandsPrefix
}