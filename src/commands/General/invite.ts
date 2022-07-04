import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import { CommandInteraction, MessageEmbed } from "discord.js"

import { Discord, Slash, SlashOption } from "@decorators"
import { Guard } from "@guards"
import { getColor } from "@utils/functions"
import { getLocaleFromInteraction, L } from "@i18n"

@Discord()
@Category('General')
export default class Invite {

	@Slash('invite', { description: 
		'A simple invite command!'
    })
	@Guard()
	invite(interaction: CommandInteraction): void {
		const locale = getLocaleFromInteraction(interaction)
		const embed = new MessageEmbed()
			.setTitle(L[locale].COMMANDS.INVITE.TITLE())
			.setDescription(L[locale].COMMANDS.INVITE.DESCRIPTION({link: "https://www.change_link_here"}))
			.setColor(getColor('primary'))
			.setFooter({ text : 'Powered by DiscBot Team ❤'})

		interaction.reply({
			
			embeds: [embed]
		

		})
	}
}