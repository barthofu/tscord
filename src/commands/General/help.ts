import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import type { CommandInteraction } from "discord.js"
import fs from 'fs'

import { Discord, Slash, SlashOption } from "@decorators"
import { Guard } from "@guards"

@Discord()
@Category('General')
export default class Help {

	@Slash('help', { description: 
		'Here goes the command description!'
    })
	@Guard()
	help(interaction: CommandInteraction): void {
		

		
		interaction.reply('help comman invoked!')
	}
}