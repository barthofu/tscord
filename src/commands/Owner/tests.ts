import { Client, ContextMenu, SimpleCommand } from "discordx"
import type { CommandInteraction } from "discord.js"
import { backup, restore } from 'saveqlite'

import { Slash, Discord, SlashOption, On } from "@decorators"
import { Guard, Match } from "@guards"
import { getImage } from "@utils/functions"
import { container } from "tsyringe"
import { Database, Stats } from "@services"

@Discord()
export default class TestsCommand {

	@On("messageCreate")
	@Guard(
		Match(/test/gim)
	)
	async testMatch(): Promise<void> {
		
		console.log('"test" trouvé !')
	}

	@SimpleCommand('dm')
	async test(interaction: CommandInteraction) {

		console.log('dm invoked')
	}

}