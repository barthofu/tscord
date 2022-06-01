import { CommandInteraction, DMChannel, PartialDMChannel, TextChannel, ThreadChannel } from "discord.js"
import { GuardFunction, SimpleCommandMessage } from "discordx"

import { resolveChannel } from "@utils/functions"

/**
 * Prevent NSFW command from running in non-NSFW channels
 */
export const NSFW: GuardFunction<
    | CommandInteraction 
    | SimpleCommandMessage
> = async(arg, client, next) => {
 
    const channel = resolveChannel(arg)

    if (!(channel instanceof TextChannel && !channel?.nsfw)) await next()
}