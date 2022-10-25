import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"

import { Discord, Slash, SlashOption } from "@decorators"
import { Guard } from "@guards"
import { injectable } from "tsyringe"
import { Logger, Stats } from "@services"

@Discord()
@Category('General')
@injectable()
export default class TestCommand {

	constructor(
		private stats: Stats
	) {
	}

	@Slash({
		name: 'test',
		description: 'Here goes the command description!'
	})
	@Guard()
	async test(
		@SlashOption({ name: 'option', type: ApplicationCommandOptionType.String }) option: string,
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {

		// console.log(interaction.options.le)

		console.log('[option]', option)
				
		interaction.followUp({ embeds: [{
			description: 'test'
		}] })
	}
}