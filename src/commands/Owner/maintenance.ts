import { Client } from "discordx"
import { CommandInteraction } from "discord.js"

import { Slash, Discord, SlashOption, Guard } from "@decorators"
import { setMaintenance, simpleSuccessEmbed } from "@utils/functions"
import { Disabled } from "@guards"

@Discord()
export default class MaintenanceCommand {

	@Slash({ 
		name: 'maintenance'
	})
	@Guard(
		Disabled
	)
	async maintenance(
		@SlashOption({ name: 'state' }) state: boolean,
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