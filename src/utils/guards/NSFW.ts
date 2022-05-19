import { CommandInteraction } from "discord.js"
import { GuardFunction, SimpleCommandMessage } from "discordx"

import { resolveChannel } from "@utils/functions"

export const NSFW: GuardFunction<
    | CommandInteraction 
    | SimpleCommandMessage
> = async(arg, client, next) => {
 
    const channel = resolveChannel(arg)

    if (channel.nsfw) await next()
}