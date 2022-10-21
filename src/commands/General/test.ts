import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import { CommandInteraction } from "discord.js"

import { Discord, Slash } from "@decorators"
import { Guard } from "@guards"

@Discord()
@Category('General')
export default class TestCommand {

	@Slash({
		name: 'test',
		description: 'Here goes the command description!'
	})
	@Guard()
	async test(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		
		interaction.followUp({ embeds: [{
			description: 'test'
		}] })
	}
}