import { Client, ArgsOf, SimpleCommandMessage } from 'discordx'

import { Maintenance } from '@guards'
import { On, Guard, Discord } from '@decorators'
import { syncUser, executeEvalFromMessage, getPrefixFromMessage } from '@utils/functions'

import { generalConfig } from '@config'

@Discord()
export default class MessageCreateEvent {

    @On("messageCreate")
    @Guard(
        Maintenance
    )
    async messageCreateHandler(
        [message]: ArgsOf<"messageCreate">, 
        client: Client
     ) {

        // insert user in db if not exists
        await syncUser(message.author)

        // eval command
        if (
            message.content.startsWith(`\`\`\`${generalConfig.eval.name}`)
            && (
                (!generalConfig.eval.onlyOwner && generalConfig.devs.includes(message.author.id))
                || (generalConfig.eval.onlyOwner && message.author.id === generalConfig.ownerId)
            )
        ) {
            executeEvalFromMessage(message)
        }

        await client.executeCommand(message, { caseSensitive: false })
    }

}