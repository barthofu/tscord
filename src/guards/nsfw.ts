import { CommandInteraction, TextChannel } from 'discord.js'
import { GuardFunction, SimpleCommandMessage } from 'discordx'

import { getLocaleFromInteraction, L } from '@/i18n'
import { replyToInteraction, resolveChannel } from '@/utils/functions'

/**
 * Prevent NSFW command from running in non-NSFW channels
 */
export const NSFW: GuardFunction<
	| CommandInteraction
	| SimpleCommandMessage
> = async (arg, client, next) => {
	const channel = resolveChannel(arg)

	if (!(channel instanceof TextChannel && !channel?.nsfw)) {
		await next()
	} else {
		const locale = getLocaleFromInteraction(arg)
		const localizedReplyMessage = L[locale].GUARDS.NSFW()

		await replyToInteraction(arg, localizedReplyMessage)
	}
}
