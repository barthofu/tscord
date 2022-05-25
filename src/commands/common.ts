import type { CommandInteraction } from "discord.js"
import { Discord, Guard, SlashOption } from "discordx"
import { Slash } from "@utils/decorators"
import { NSFW, disabled } from "@guards"
import { injectable } from "tsyringe"
import { Client } from "@core/Client"

@Discord()
@injectable()
export default class {
	
	constructor(
		private client: Client
	) {}

	@Slash("ping")
	@Guard(
		NSFW,
		disabled
	)
	ping(interaction: CommandInteraction): void {
		
		interaction.reply('pong')
	}

	@Slash("maintenance")
	maintenance(
		@SlashOption('state') state: boolean,
		interaction: CommandInteraction
	): void {
		
		this.client.setMaintenance(state)
	}
}
