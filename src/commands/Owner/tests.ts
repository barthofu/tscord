import { Client } from "discordx"
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

	@Slash('test')
	async test(interaction: CommandInteraction) {

		const stats = container.resolve(Stats)
		for (let i = 0; i < 10000; i++) {

			await stats.registerDailyStats()
		}
	}

	@Slash('backup')
	async backup() {

		backup('database/db.sqlite', 'snapshot1.txt', 'database/backups/objects/')
	}
}