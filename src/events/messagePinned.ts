import { Client } from 'discordx'
import { Message } from 'discord.js'

import { On, Discord } from '@decorators'

@Discord()
export default class messagePinnedEvent {

    @On('messagePinned')
    async messagePinnedHandler(
        [message]: [Message],
        client: Client
    ) {
        console.log(`This message from ${message.author.tag} has been pinned : ${message.content}`)
    }
}