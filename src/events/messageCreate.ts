import { ArgsOf, Client } from "discordx"

import { Discord, Guard, On } from "@decorators"
import { Maintenance } from "@guards"
import { executeEvalFromMessage, isDev } from "@utils/functions"

import { generalConfig } from "@configs"

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

        // eval command
        if (
            message.content.startsWith(`\`\`\`${generalConfig.eval.name}`)
            && (
                (!generalConfig.eval.onlyOwner && isDev(message.author.id))
                || (generalConfig.eval.onlyOwner && message.author.id === generalConfig.ownerId)
            )
        ) {
            executeEvalFromMessage(message)
        }

        await client.executeCommand(message, false)
    }

}