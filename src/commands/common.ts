import { Client } from "discordx"
import type { CommandInteraction } from "discord.js"

import { Slash, Discord, Guard, SlashOption } from "@decorators"
import { setMaintenance } from "@utils/functions"
import { NSFW, Disabled } from "@guards"

@Discord()
export default class Common {

	@Slash("ping")
	@Guard(
		NSFW,
		Disabled
	)
	ping(interaction: CommandInteraction): void {
		
		interaction.reply('pong')
	}

	@Slash("maintenance")
	async maintenance(
		@SlashOption('state') state: boolean,
		interaction: CommandInteraction
	): Promise<void> {
		
		await setMaintenance(state)
	}

	@Slash("dev")
	async dev(interaction: CommandInteraction, client: Client): Promise<void> {
		
		console.log(1)
	}
}
