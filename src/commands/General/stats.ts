import {
	Pagination,
	PaginationType,
} from '@discordx/pagination'
import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, User } from 'discord.js'
import { Client } from 'discordx'
import { injectable } from 'tsyringe'

import { Discord, Slash, SlashOption } from '@/decorators'
import { Stats } from '@/services'
import { getColor } from '@/utils/functions'

const statsResolver: StatsResolverType = [
	{
		name: 'COMMANDS',
		data: async (stats: Stats, days: number) => {
			const simpleCommandMessages = await stats.countStatsPerDays('SIMPLE_COMMAND_MESSAGE', days)
			const commandInteractions = await stats.countStatsPerDays('CHAT_INPUT_COMMAND_INTERACTION', days)
			const userContextMenus = await stats.countStatsPerDays('USER_CONTEXT_MENU_COMMAND_INTERACTION', days)
			const messageContextMenus = await stats.countStatsPerDays('MESSAGE_CONTEXT_MENU_COMMAND_INTERACTION', days)

			return stats.sumStats(
				stats.sumStats(simpleCommandMessages, commandInteractions),
				stats.sumStats(userContextMenus, messageContextMenus)
			)
		},
	},
	{
		name: 'GUILDS',
		data: async (stats, days) => (await stats.countStatsPerDays('TOTAL_GUILDS', days)),
	},
	{
		name: 'ACTIVE_USERS',
		data: async (stats, days) => (await stats.countStatsPerDays('TOTAL_ACTIVE_USERS', days)),
	},
	{
		name: 'USERS',
		data: async (stats, days) => (await stats.countStatsPerDays('TOTAL_USERS', days)),
	},
]

@Discord()
@injectable()
@Category('General')
export default class StatsCommand {

	constructor(
		private stats: Stats
	) {}

	@Slash({
		name: 'stats',
	})
	async statsHandler(
		@SlashOption({ name: 'days', type: ApplicationCommandOptionType.Number, required: true }) days: number,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const embeds: EmbedBuilder[] = []

		for (const stat of statsResolver) {
			const stats = await stat.data(this.stats, days)
			const link = await this.generateLink(
				stats,
				localize.COMMANDS.STATS.HEADERS[stat.name as keyof typeof localize['COMMANDS']['STATS']['HEADERS']]()
			)
			const embed = this.getEmbed(interaction.user, link)

			embeds.push(embed)
		}

		await new Pagination(
			interaction,
			embeds.map(embed => ({
				embeds: [embed],
			})),
			{
				type: PaginationType.Button,
			}
		).send()
	}

	async generateLink(stats: StatPerInterval, name: string): Promise<string> {
		const obj = {

			type: 'line',
			data: {
				labels: stats.map(stat => stat.date.split('/').slice(0, 2).join('/')), // we remove the year from the date
				datasets: [
					{
						label: '',
						data: stats.map(stat => stat.count),
						fill: true,
						backgroundColor: 'rgba(252,231,3,0.1)',
						borderColor: 'rgb(252,186,3)',
						borderCapStyle: 'round',
						lineTension: 0.3,
					},
				],
			},
			options: {
				title: {
					display: true,
					text: name,
					fontColor: 'rgba(255,255,254,0.6)',
					fontSize: 20,
					padding: 15,
				},
				legend: { display: false },
				scales: {
					xAxes: [{ ticks: { fontColor: 'rgba(255,255,254,0.6)' } }],
					yAxes: [{ ticks: { fontColor: 'rgba(255,255,254,0.6)', beginAtZero: false, stepSize: 1 } }],
				},
			},
		}

		return `https://quickchart.io/chart?c=${JSON.stringify(obj)}&format=png`.split(' ').join('%20')
	}

	getEmbed(author: User, link: string): EmbedBuilder {
		return new EmbedBuilder()
			.setAuthor({
				name: author.username,
				iconURL: author.displayAvatarURL({ forceStatic: false }),
			})
			.setColor(getColor('primary'))
			.setImage(link)
	}

}
