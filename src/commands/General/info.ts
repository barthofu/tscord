import { injectable } from "tsyringe"
import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, EmbedField } from "discord.js"
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)

import { Discord, Slash } from "@decorators"
import { Guard } from "@guards"
import { formatDate, getColor, isValidUrl, timeAgo } from "@utils/functions"
import { generalConfig } from "@config"
import { Stats } from "@services"

import packageJSON from '../../../package.json'

const links = [
	{ label: 'Invite me!', url: generalConfig.links.invite },
	{ label: 'Support server', url: generalConfig.links.supportServer },
	{ label: 'Github', url: generalConfig.links.gitRemoteRepo }
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
		client: Client,
		{ localize }: InteractionData
	) {
		
		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setTitle(client.user!.tag)
			.setThumbnail(client.user!.displayAvatarURL())
			.setColor(getColor('primary'))
			.setDescription(packageJSON.description)

		const fields: EmbedField[] = []

		/**
		 * Owner field
		 */
		const owner = await client.users.fetch(generalConfig.ownerId)
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
			value: `v${packageJSON.version}`,
			inline: true,
		})

		/**
		 * Framework/template field
		 */
		fields.push({
			name: 'Framework/template',
			value: `[TSCord](https://github.com/barthofu/tscord) (*v${generalConfig.__templateVersion}*)`,
			inline: true,
		})

		/**
		 * Libraries field
		 */
		fields.push({
			name: 'Libraries',
			value: `[discord.js](https://discord.js.org/) (*v${packageJSON.dependencies['discord.js'].replace('^', '')}*)\n[discordx](https://discordx.js.org/) (*v${packageJSON.dependencies['discordx'].replace('^', '')}*)`,
			inline: true,
		})

		// add the fields to the embed
		embed.addFields(fields)

		/**
		 * Define links buttons
		 */
		const buttons = links
			.map(link => {
				const url = link.url.split('_').join('')
				if (isValidUrl(url)) {
					return new ButtonBuilder()
						.setLabel(link.label)
						.setURL(url)
						.setStyle(ButtonStyle.Link)
				} else return null
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