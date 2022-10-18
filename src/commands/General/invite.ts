import { Category } from "@discordx/utilities"
import { CommandInteraction, EmbedBuilder } from "discord.js"
import { Client } from "discordx"

import { generalConfig } from "@config"
import { Discord, Slash } from "@decorators"
import { Guard } from "@guards"
import { getColor } from "@utils/functions"

@Discord()
@Category('General')
export default class InviteCommand {

	@Slash({ 
		name: 'invite'
    })
	@Guard()
	async invite(
		interaction: CommandInteraction, 
		client: Client,
		{ localize }: InteractionData
	) {

		const embed = new EmbedBuilder()
			.setTitle(localize.COMMANDS.INVITE.EMBED.TITLE())
			.setDescription(localize.COMMANDS.INVITE.EMBED.DESCRIPTION({link: generalConfig.links.invite}))
			.setColor(getColor('primary'))
			.setFooter({ text : 'Powered by DiscBot Team ❤'})

		interaction.followUp({
			embeds: [embed]
		})
	}
}