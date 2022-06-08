import { Client } from "discordx"
import type { CommandInteraction } from "discord.js"

import { Slash, Discord, Guard, SlashOption, On } from "@decorators"
import { setMaintenance } from "@utils/functions"
import { NSFW, Disabled, MessageMatch } from "@guards"

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

	@On("messageCreate")
	@Guard(
		MessageMatch(/test/gim)
	)
	async dev(): Promise<void> {
		
		console.log('"test" trouvé !')
	}
}
