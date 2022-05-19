import type { CommandInteraction } from "discord.js"
import { Discord, Guard, SlashOption } from "discordx"
import { Slash } from "@decorators"
import { StateStore } from '@core/stores'
import { NSFW } from "@utils/guards"

@Discord()
export default class {
	
	@Slash("ping")
	@Guard(
		NSFW
	)
	ping(interaction: CommandInteraction): void {
		
		interaction.reply('test2')
	}
}
