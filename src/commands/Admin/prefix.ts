import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import type { CommandInteraction } from "discord.js"
import { injectable } from "tsyringe"

import { Slash, Discord, SlashOption } from "@decorators"
import { Guard, UserPermissions } from "@guards"
import { Guild } from "@entities"
import { resolveGuild, simpleSuccessEmbed } from "@utils/functions"
import { Database, ErrorHandler } from "@services"
import { getLocaleFromInteraction, L } from "@i18n"

import { generalConfig } from '@configs'

@Discord()
@injectable()
@Category('Admin')
export default class Prefix {

	constructor(
		private db: Database,
		private errorHandler: ErrorHandler
	) {}

	@Slash('prefix', { description: 
		'Here goes the command description!'
    })
	@Guard(
		UserPermissions(['ADMINISTRATOR'])
	)
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
					prefix: prefix || generalConfig.simpleCommandsPrefix 
				}))
		} 
		else {
			this.errorHandler.unknownErrorReply(interaction)
		}
			  
	}
}