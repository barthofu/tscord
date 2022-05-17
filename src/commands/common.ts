import type { CommandInteraction } from "discord.js"
import { Discord, SlashOption } from "discordx"
import { Slash } from "@decorators"
import { StateStore } from '@core/stores'

@Discord()
export default class {
	
	@Slash("ping", { nsfw: true })
	ping(interaction: CommandInteraction): void {
		
		console.log(interaction)
		interaction.reply('test')
	}
}
