import { Controller, Get, QueryParams, UseBefore } from '@tsed/common'
import { Client, ShardingManager } from 'discord.js'

import { DevAuthenticated } from '@/api/middlewares'
import { Stat, User } from '@/entities'
import { Database, Stats } from '@/services'
import { BaseController } from '@/utils/classes'
import { resolveDependencies } from '@/utils/functions'

const allInteractions = {
	$or: [
		{ type: 'SIMPLE_COMMAND_MESSAGE' },
		{ type: 'CHAT_INPUT_COMMAND_INTERACTION' },
		{ type: 'USER_CONTEXT_MENU_COMMAND_INTERACTION' },
		{ type: 'MESSAGE_CONTEXT_MENU_COMMAND_INTERACTION' },
	],
}

@Controller('/stats')
@UseBefore(
	DevAuthenticated
)
export class StatsController extends BaseController {

	private manager: ShardingManager
	private db: Database

	constructor() {
		super()

		resolveDependencies([ShardingManager, Database]).then(([manager, db]) => {
			this.manager = manager
			this.db = db
		})
	}

	@Get('/totals')
	async info() {
		const totalStats = await this.manager.broadcastEval(async (client: Client) => {
			return {
				TOTAL_USERS: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
				TOTAL_GUILDS: client.guilds.cache.size,
			}
		})

		return {
			stats: {
				totalUsers: totalStats.reduce((acc, curr) => acc + curr.TOTAL_USERS, 0),
				totalGuilds: totalStats.reduce((acc, curr) => acc + curr.TOTAL_GUILDS, 0),
				totalActiveUsers: await this.db.get(User).count(),
				totalCommands: await this.db.get(Stat).count(allInteractions),
			},
		}
	}

	// @Get('/interaction/last')
	// async lastInteraction() {
	// 	const lastInteraction = await this.stats.getLastInteraction()

	// 	return lastInteraction
	// }

	// @Get('/guilds/last')
	// async lastGuildAdded() {
	// 	const lastGuild = await this.stats.getLastGuildAdded()

	// 	return lastGuild
	// }

	// @Get('/commands/usage')
	// async commandsUsage(@QueryParams('numberOfDays') numberOfDays: number = 7) {
	// 	const commandsUsage = {
	// 		slashCommands: await this.stats.countStatsPerDays('CHAT_INPUT_COMMAND_INTERACTION', numberOfDays),
	// 		simpleCommands: await this.stats.countStatsPerDays('SIMPLE_COMMAND_MESSAGE', numberOfDays),
	// 		userContextMenus: await this.stats.countStatsPerDays('USER_CONTEXT_MENU_COMMAND_INTERACTION', numberOfDays),
	// 		messageContextMenus: await this.stats.countStatsPerDays('MESSAGE_CONTEXT_MENU_COMMAND_INTERACTION', numberOfDays),
	// 	}

	// 	const body = []
	// 	for (let i = 0; i < numberOfDays; i++) {
	// 		body.push({
	// 			date: commandsUsage.slashCommands[i].date,
	// 			slashCommands: commandsUsage.slashCommands[i].count,
	// 			simpleCommands: commandsUsage.simpleCommands[i].count,
	// 			contextMenus: commandsUsage.userContextMenus[i].count + commandsUsage.messageContextMenus[i].count,
	// 		})
	// 	}

	// 	return body
	// }

	// @Get('/commands/top')
	// async topCommands() {
	// 	const topCommands = await this.stats.getTopCommands()

	// 	return topCommands
	// }

	// @Get('/users/activity')
	// async usersActivity() {
	// 	const usersActivity = await this.stats.getUsersActivity()

	// 	return usersActivity
	// }

	// @Get('/guilds/top')
	// async topGuilds() {
	// 	const topGuilds = await this.stats.getTopGuilds()

	// 	return topGuilds
	// }

	// @Get('/usersAndGuilds')
	// async usersAndGuilds(@QueryParams('numberOfDays') numberOfDays: number = 7) {
	// 	return {
	// 		activeUsers: await this.stats.countStatsPerDays('TOTAL_ACTIVE_USERS', numberOfDays),
	// 		users: await this.stats.countStatsPerDays('TOTAL_USERS', numberOfDays),
	// 		guilds: await this.stats.countStatsPerDays('TOTAL_GUILDS', numberOfDays),
	// 	}
	// }

}
