import type { CommandInteraction } from "discord.js"
import { Discord, Guard, SlashOption } from "discordx"
import { container, injectable } from "tsyringe"

import { Slash } from "@utils/decorators"
import { setMaintenance } from "@utils/functions"
import { NSFW, Disabled } from "@guards"
import { Client } from "@core/Client"
import { Stats } from "@helpers"

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
		
	}
}
