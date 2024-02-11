import { Category } from '@discordx/utilities'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, EmbedField } from 'discord.js'
import { Client } from 'discordx'
import { injectable } from 'tsyringe'

import { generalConfig } from '@/configs'
import { Discord, Slash } from '@/decorators'
import { Guard } from '@/guards'
import { Stats } from '@/services'
import { getColor, getTscordVersion, isValidUrl, timeAgo } from '@/utils/functions'

import packageJson from '../../../package.json' assert { type: 'json' }

dayjs.extend(relativeTime)

const links = [
	{ label: 'Invite me!', url: generalConfig.links.invite },
	{ label: 'Support server', url: generalConfig.links.supportServer },
	{ label: 'Github', url: generalConfig.links.gitRemoteRepo },
]

@Discord()
@injectable()
@Category('General')
export default class InfoCommand {

	constructor(
		private stats: Stats
	) {}

	@Slash({
		name: 'info',
	})
	@Guard()
	async info(
		interaction: CommandInteraction,
		client: Client
	) {
		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setTitle(client.user!.tag)
			.setThumbnail(client.user!.displayAvatarURL())
			.setColor(getColor('primary'))
			.setDescription(packageJson.description)

		const fields: EmbedField[] = []

		/**
		 * Owner field
		 */
		const owner = await client.users.fetch(generalConfig.ownerId).catch(() => null)
		if (owner) {
			fields.push({
				name: 'Owner',
				value: `\`${owner.tag}\``,
				inline: true,
			})
		}

		/**
		 * Uptime field
		 */
		const uptime = timeAgo(new Date(Date.now() - client.uptime!))
		fields.push({
			name: 'Uptime',
			value: uptime,
			inline: true,
		})

		/**
		 * Totals field
		 */
		const totalStats = await this.stats.getTotalStats()
		fields.push({
			name: 'Totals',
			value: `**${totalStats.TOTAL_GUILDS}** guilds\n**${totalStats.TOTAL_USERS}** users\n**${totalStats.TOTAL_COMMANDS}** commands`,
			inline: true,
		})

		/**
		 * Bot version field
		 */
		fields.push({
			name: 'Bot version',
			value: `v${packageJson.version}`,
			inline: true,
		})

		/**
		 * Framework/template field
		 */
		fields.push({
			name: 'Framework/template',
			value: `[TSCord](https://github.com/barthofu/tscord) (*v${getTscordVersion()}*)`,
			inline: true,
		})

		/**
		 * Libraries field
		 */
		fields.push({
			name: 'Libraries',
			value: `[discord.js](https://discord.js.org/) (*v${packageJson.dependencies['discord.js'].replace('^', '')}*)\n[discordx](https://discordx.js.org/) (*v${packageJson.dependencies.discordx.replace('^', '')}*)`,
			inline: true,
		})

		// add the fields to the embed
		embed.addFields(fields)

		/**
		 * Define links buttons
		 */
		const buttons = links
			.map((link) => {
				const url = link.url.split('_').join('')
				if (isValidUrl(url)) {
					return new ButtonBuilder()
						.setLabel(link.label)
						.setURL(url)
						.setStyle(ButtonStyle.Link)
				} else {
					return null
				}
			})
			.filter(link => link) as ButtonBuilder[]
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(...buttons)

		// finally send the embed
		interaction.followUp({
			embeds: [embed],
			components: [row],
		})
	}

}
