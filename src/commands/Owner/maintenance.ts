import { Slash, Discord, SlashOption, Guard } from "@decorators"
import { setMaintenance, simpleSuccessEmbed } from "@utils/functions"
import { getLocaleFromInteraction, L } from "@i18n"
import { Disabled } from "@guards"
import { CommandInteraction } from "discord.js"

@Discord()
export default class MaintenanceCommand {

	@Slash({ 
		name: 'maintenance',
		description: 'Set the bot in maintenance mode.'
	})
	@Guard(
		Disabled
	)
	async maintenance(
		@SlashOption({ name: 'state' }) state: boolean,
		interaction: CommandInteraction,
		{ localize }: InteractionData
	) {
				
		await setMaintenance(state)

		simpleSuccessEmbed(
			interaction, 
			localize['COMMANDS']['MAINTENANCE']['SUCCESS']({
				state: state ? 'on' : 'off'
			})
		)
	}
}