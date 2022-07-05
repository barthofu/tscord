import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import { CommandInteraction, MessageEmbed } from "discord.js"

import { Discord, Slash, SlashOption } from "@decorators"
import { Guard } from "@guards"
import { getColor } from "@utils/functions"
import { getLocaleFromInteraction, L } from "@i18n"
import { generalConfig } from "@config"

@Discord()
@Category('General')
export default class InviteCommand {

	@Slash('invite', { description: 
		'A simple invite command!'
    })
	@Guard()
	invite(interaction: CommandInteraction): void {

		const locale = getLocaleFromInteraction(interaction)

		const embed = new MessageEmbed()
			.setTitle(L[locale].COMMANDS.INVITE.TITLE())
			.setDescription(L[locale].COMMANDS.INVITE.DESCRIPTION({link: generalConfig.inviteLink}))
			.setColor(getColor('primary'))
			.setFooter({ text : 'Powered by DiscBot Team ❤'})

		interaction.reply({
			embeds: [embed]
		})
	}
}