import type { CommandInteraction } from "discord.js"

import { Discord, Slash } from "@decorators"
import { Disabled, Guard } from "@guards"

@Discord()
export default class TestsCommand {

	@Slash('test')
	@Guard(
		Disabled
	)
	async test(interaction: CommandInteraction) {

		console.log('test invoked')
	}

}