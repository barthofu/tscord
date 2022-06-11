import { CommandInteraction } from "discord.js"

import { Slash, Discord, SlashOption } from "@decorators"
import { setMaintenance, simpleSuccessEmbed } from "@utils/functions"
import { getLocaleFromInteraction, L } from "@i18n"

@Discord()
export default class Maintenance {

	@Slash("maintenance", { description:
		'Set the bot in maintenance mode.'
	})
	async maintenance(
		@SlashOption('state') state: boolean,
		interaction: CommandInteraction
	): Promise<void> {
		
		await setMaintenance(state)

		const locale = getLocaleFromInteraction(interaction)
		simpleSuccessEmbed(
			interaction, 
			L[locale]['COMMANDS']['MAINTENANCE']['SUCCESS']({
				state: state ? 'on' : 'off'
			})
		)
	}
}