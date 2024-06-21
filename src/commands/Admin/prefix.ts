import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import { Client } from 'discordx'

import { generalConfig } from '@/configs'
import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Guild } from '@/entities'
import { UnknownReplyError } from '@/errors'
import { Guard, UserPermissions } from '@/guards'
import { Database } from '@/services'
import { resolveGuild, simpleSuccessEmbed } from '@/utils/functions'

@Discord()
@Injectable()
@Category('Admin')
export default class PrefixCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'prefix' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async prefix(
		@SlashOption({
			name: 'prefix',
			localizationSource: 'COMMANDS.PREFIX.OPTIONS.PREFIX',
			type: ApplicationCommandOptionType.String,
		}) prefix: string | undefined,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const guild = resolveGuild(interaction)
		const guildData = await this.db.get(Guild).findOne({ id: guild?.id || '' })

		if (guildData) {
			guildData.prefix = prefix || null
			this.db.em.persistAndFlush(guildData)

			simpleSuccessEmbed(
				interaction,
				localize.COMMANDS.PREFIX.EMBED.DESCRIPTION({
					prefix: prefix || generalConfig.simpleCommandsPrefix,
				})
			)
		} else {
			throw new UnknownReplyError(interaction)
		}
	}

}
