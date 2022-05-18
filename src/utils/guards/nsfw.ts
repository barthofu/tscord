import { CommandInteraction } from "discord.js"
import { GuardFunction, SimpleCommandMessage } from "discordx"

import { getCommandInStoreFromInteraction } from "@utils/functions/commands"
import { getChannelFromInteraction } from "@utils/functions/interactions"

export const nsfw: GuardFunction<
    | CommandInteraction
    | SimpleCommandMessage
> = async(arg, _, next) => {

    const argObj = arg instanceof Array ? arg[0] : arg,
          channel = getChannelFromInteraction(argObj),
          command = getCommandInStoreFromInteraction(argObj)

    if (!(command?.nsfw && !channel?.nsfw)) await next()
}