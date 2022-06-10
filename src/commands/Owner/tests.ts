import { Client } from "discordx"
import type { CommandInteraction } from "discord.js"

import { Slash, Discord, SlashOption, On } from "@decorators"
import { Guard, Match } from "@guards"

@Discord()
export default class Tests {

	@On("messageCreate")
	@Guard(
		Match(/test/gim)
	)
	async testMatch(): Promise<void> {
		
		console.log('"test" trouvé !')
	}
}