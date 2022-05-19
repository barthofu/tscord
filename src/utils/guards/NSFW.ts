import { CommandInteraction } from "discord.js"
import { GuardFunction, SimpleCommandMessage } from "discordx"

import { resolveChannel } from "@utils/functions"

export const NSFW: GuardFunction<
    | CommandInteraction
    | SimpleCommandMessage
> = async(arg: CommandInteraction | SimpleCommandMessage, _, next) => {

    const channel = resolveChannel(arg)

    console.log(channel.nsfw)

    if (channel.nsfw) await next()
    
    // await next()

    // const argObj = arg instanceof Array ? arg[0] : arg,
    //       channel = getChannelFromInteraction(argObj),
    //       command = getCommandInStoreFromInteraction(argObj)

    // if (!(command?.nsfw && !channel?.nsfw)) await next()
}