import { resolveUser } from "@utils/functions";
import {
    ButtonInteraction,
    CommandInteraction,
    ContextMenuInteraction,
    Message,
    MessageReaction,
    SelectMenuInteraction,
    VoiceState,
} from "discord.js"
import type { ArgsOf, GuardFunction } from "discordx"
import { SimpleCommandMessage } from "discordx"
  
export const NotBot: GuardFunction<
    | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
    | CommandInteraction
    | ContextMenuInteraction
    | SelectMenuInteraction
    | ButtonInteraction
    | SimpleCommandMessage
  > = async (arg, client, next) => {

    const argObj = arg instanceof Array ? arg[0] : arg

    const user = resolveUser(argObj as any)

    if (!user?.bot) await next()
}