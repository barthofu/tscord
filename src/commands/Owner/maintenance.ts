import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Client } from "discordx"

import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { Disabled } from "@guards"
import { setMaintenance, simpleSuccessEmbed } from "@utils/functions"

@Discord()
export default class MaintenanceCommand {

	@Slash({ 
		name: 'maintenance'
	})
	@Guard(
		Disabled
	)
	async maintenance(
		@SlashOption({ name: 'state', type: ApplicationCommandOptionType.Boolean, required: true }) state: boolean,
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
				
		await setMaintenance(state)

		simpleSuccessEmbed(
			interaction, 
			localize.COMMANDS.MAINTENANCE.EMBED.DESCRIPTION({
				state: state ? 'on' : 'off'
			})
		)
	}
}