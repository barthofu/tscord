import type { ArgsOf, GuardFunction } from "discordx"

import { resolveUser } from "@utils/functions"
  
/**
 * Prevent other bots to interact with this bot
 */
export const NotBot: GuardFunction<
  	| EmittedInteractions
  	| ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
> = async (arg, client, next) => {

    const parsedArg = arg instanceof Array ? arg[0] : arg,
          user = resolveUser(parsedArg)

    if (!user?.bot) await next()
}