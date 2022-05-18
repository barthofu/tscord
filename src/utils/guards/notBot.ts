import type { ArgsOf } from "discordx"
import { GuardFunction, SimpleCommandMessage } from "discordx"
import {
	ButtonInteraction,
	CommandInteraction,
	ContextMenuInteraction,
	SelectMenuInteraction,
} from "discord.js"
import { getUserFromInteraction } from "@utils/functions/interactions"

export const notBot: GuardFunction<
	| ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
	| CommandInteraction
	| ContextMenuInteraction
	| SelectMenuInteraction
	| ButtonInteraction
	| SimpleCommandMessage
> = async (arg, _, next) => {

	const argObj = arg instanceof Array ? arg[0] : arg,
			user = getUserFromInteraction(argObj)

	if (!user?.bot) await next()
}