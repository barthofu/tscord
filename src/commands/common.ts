import type { CommandInteraction } from "discord.js"
import { Discord, Guard, SlashOption } from "discordx"
import { injectable } from "tsyringe"

import { Slash } from "@utils/decorators"
import { setMaintenance } from "@utils/functions"
import { NSFW, Disabled } from "@guards"
import { Client } from "@core/Client"

@Discord()
export default class {

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
}
