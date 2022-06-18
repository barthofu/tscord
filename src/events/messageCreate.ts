import { Client, ArgsOf } from 'discordx'

import { Maintenance } from '@guards'
import { On, Guard, Discord } from '@decorators'
import { syncUser, executeEvalFromMessage } from '@utils/functions'

import { generalConfig } from '@config'

@Discord()
export default class MessageCreate {

    @On("messageCreate")
    @Guard(
        Maintenance
    )
    async messageCreate([message]: ArgsOf<"messageCreate">, client: Client): Promise<void> {

        // insert user in db if not exists
        await syncUser(message.author)

        // eval command
        if (
            message.content.startsWith(`\`\`\`${generalConfig.eval.name}`)
            && (
                (!generalConfig.eval.onlyOwner && generalConfig.devs.includes(message.author.id))
                || (generalConfig.eval.onlyOwner && message.author.id === generalConfig.owner)
            )
        ) {
            executeEvalFromMessage(message)
        }

        await client.executeCommand(message, { caseSensitive: false })
    }

}