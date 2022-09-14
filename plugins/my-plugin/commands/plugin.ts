import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import { CommandInteraction } from "discord.js"

import { Discord, Slash } from "@decorators"
import { Guard } from "@guards"
import { pluginConfig } from "@config/my-plugin"

@Discord()
@Category('General')
export default class PluginCommand {

	@Slash({
		name: 'plugin',
		description: 'Here goes the command description!'
	})
	@Guard()
	async plugin(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		interaction.followUp('Plugin command works!\nconfig: '+pluginConfig.enabled);
	}
}