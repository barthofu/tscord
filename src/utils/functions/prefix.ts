import { Message } from 'discord.js'

import config from '../../../config.json'

export const getPrefixFromMessage = (message: Message) => {

    return config.simpleCommandsPrefix
}