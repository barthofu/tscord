import { ArgsOf, GuardFunction } from 'discordx'

import { resolveUser } from '@/utils/functions'

/**
 * Prevent other bots to interact with this bot
 */
export const NotBot: GuardFunction<
	| EmittedInteractions
	| ArgsOf<'messageCreate' | 'messageReactionAdd' | 'voiceStateUpdate'>
> = async (arg, client, next) => {
	const parsedArg = Array.isArray(arg) ? arg[0] : arg
	const user = resolveUser(parsedArg)

	if (!user?.bot)
		await next()
}
