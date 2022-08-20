import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import { CommandInteraction, EmbedBuilder } from "discord.js"

import { Discord, Slash } from "@decorators"
import { Guard } from "@guards"
import { getColor } from "@utils/functions"
import { generalConfig } from "@config"

@Discord()
@Category('General')
export default class InviteCommand {

	@Slash({ 
		name: 'invite',
		description: 'A simple invite command!'
    })
	@Guard()
	async invite(
		interaction: CommandInteraction, 
		client: Client,
		{ localize }: InteractionData
	) {

		const embed = new EmbedBuilder()
			.setTitle(localize.COMMANDS.INVITE.TITLE())
			.setDescription(localize.COMMANDS.INVITE.DESCRIPTION({link: generalConfig.inviteLink}))
			.setColor(getColor('primary'))
			.setFooter({ text : 'Powered by DiscBot Team ❤'})

		interaction.followUp({
			embeds: [embed]
		})
	}
}