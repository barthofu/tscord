import { CommandInteraction, EmbedBuilder } from 'discord.js'

import { replyToInteraction } from '@/utils/functions'

/**
 * Send a simple success embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export function simpleSuccessEmbed(interaction: CommandInteraction, message: string) {
	const embed = new EmbedBuilder()
		.setColor(0x57F287) // GREEN // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
		.setTitle(`✅ ${message}`)

	replyToInteraction(interaction, { embeds: [embed] })
}

/**
 * Send a simple error embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export function simpleErrorEmbed(interaction: CommandInteraction, message: string) {
	const embed = new EmbedBuilder()
		.setColor(0xED4245) // RED // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
		.setTitle(`❌ ${message}`)

	replyToInteraction(interaction, { embeds: [embed] })
}
