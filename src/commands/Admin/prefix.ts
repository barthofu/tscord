import { Category } from "@discordx/utilities"
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { injectable } from "tsyringe"

import { Slash, Discord, SlashOption } from "@decorators"
import { Guard, UserPermissions } from "@guards"
import { Guild } from "@entities"
import { resolveGuild, simpleSuccessEmbed } from "@utils/functions"
import { Database } from "@services"

import { generalConfig } from '@config'
import { UnknownReplyError } from "@errors"

@Discord()
@injectable()
@Category('Admin')
export default class PrefixCommand {

	constructor(
		private db: Database,
	) {}

	@Slash('prefix', { description: 
		'Here goes the command description!'
    })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async prefix(
		@SlashOption('prefix', { required: false, type: ApplicationCommandOptionType.String }) prefix: string | undefined,
		interaction: CommandInteraction,
		{ localize }: InteractionData
	) {

	
		const guild = resolveGuild(interaction),
			  guildData = await this.db.getRepo(Guild).findOne({ id: guild?.id || '' })

		if (guildData) {

			guildData.prefix = prefix || null
			this.db.getRepo(Guild).persistAndFlush(guildData)

			simpleSuccessEmbed(
				interaction, 
				localize['COMMANDS']['PREFIX']['CHANGED']({ 
					prefix: prefix || generalConfig.simpleCommandsPrefix 
				})
			)
		} 
		else {
			throw new UnknownReplyError(interaction)
		}
			  
	}
}