import type { CommandInteraction } from "discord.js"

import { Discord } from "discordx"
import { Slash } from "@decorators"

@Discord()
export class Example {
	
	@Slash("hello")
	ping(interaction: CommandInteraction): void {
		interaction.reply("pong 8!")
	}
}
