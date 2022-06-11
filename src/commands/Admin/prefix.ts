import { Client } from "discordx"
import type { CommandInteraction } from "discord.js"
import { injectable } from "tsyringe"

import { Database } from "@core/Database"
import { Slash, Discord, SlashOption } from "@decorators"
import { Guard } from "@guards"
import { Guild } from "@entities"
import { resolveGuild, simpleSuccessEmbed } from "@utils/functions"
import { ErrorHandler } from "@helpers"
import { getLocaleFromInteraction, L } from "@i18n"

import config from '../../../config.json'

@Discord()
@injectable()
export default class Prefix {

	constructor(
		private db: Database,
		private errorHandler: ErrorHandler
	) {}

	@Slash('prefix', { description: 
		'Here goes the command description!'
    })
	@Guard()
	async prefix(
		@SlashOption('prefix', { required: false, type: 'STRING' }) prefix: string | undefined,
		interaction: CommandInteraction
	): Promise<void> {
		
		const guild = resolveGuild(interaction),
			  guildData = await this.db.getRepo(Guild).findOne({ id: guild?.id || '' })

		if (guildData) {

			guildData.prefix = prefix || null
			this.db.getRepo(Guild).persistAndFlush(guildData)
			
			const locale = getLocaleFromInteraction(interaction)
			simpleSuccessEmbed(
				interaction, 
				L[locale]['COMMANDS']['PREFIX']['CHANGED']({ 
					prefix: prefix || config.simpleCommandsPrefix 
				}))
		} 
		else {
			this.errorHandler.unknownErrorReply(interaction)
		}
			  
	}
}