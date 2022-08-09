import { Slash, Discord, SlashOption, Guard } from "@decorators"
import { setMaintenance, simpleSuccessEmbed } from "@utils/functions"
import { getLocaleFromInteraction, L } from "@i18n"
import { Disabled } from "@guards"
import { CommandInteraction } from "discord.js"

@Discord()
export default class MaintenanceCommand {

	@Slash("maintenance", { description:
		'Set the bot in maintenance mode.'
	})
	@Guard(
		Disabled
	)
	async maintenance(
		@SlashOption('state') state: boolean,
		interaction: CommandInteraction,
		{ localize }: InteractionData
	) {
				
		await setMaintenance(state)

		const locale = getLocaleFromInteraction(interaction)
		simpleSuccessEmbed(
			interaction, 
			localize['COMMANDS']['MAINTENANCE']['SUCCESS']({
				state: state ? 'on' : 'off'
			})
		)
	}
}