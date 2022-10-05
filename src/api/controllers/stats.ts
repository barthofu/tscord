import { authenticated } from "@api/middlewares"
import { Stats } from "@services"
import { BaseController } from "@utils/classes"
import { Get, JsonController, QueryParam, UseBefore } from "routing-controllers"
import { injectable } from "tsyringe"

@JsonController('/stats')
@UseBefore(
    authenticated
)
@injectable()
export class StatsController extends BaseController {

    constructor(
        private readonly stats: Stats,
    ) {
        super()
    }

    @Get('/totals')
    async info() {

        const totalStats = await this.stats.getTotalStats()

        return {
            stats: {
                totalUsers: totalStats.TOTAL_USERS,
                totalGuilds: totalStats.TOTAL_GUILDS,
                totalActiveUsers: totalStats.TOTAL_ACTIVE_USERS,
                totalCommands: totalStats.TOTAL_COMMANDS,
            }
        }
    }

    @Get('/interaction/last')
    async lastInteraction() {

        const lastInteraction = await this.stats.getLastInteraction()
        return lastInteraction
    }

    @Get('/guilds/last')
    async lastGuildAdded() {

        const lastGuild = await this.stats.getLastGuildAdded()
        return lastGuild
    }

    @Get('/commands/usage')
    async commandsUsage(@QueryParam('numberOfDays', { type: Number }) numberOfDays: number = 7) {
        
        const commandsUsage = {
            slashCommands: await this.stats.countStatsPerDays('CHAT_INPUT_COMMAND_INTERACTION', numberOfDays),
            simpleCommands: await this.stats.countStatsPerDays('SIMPLE_COMMAND_MESSAGE', numberOfDays),
            userContextMenus: await this.stats.countStatsPerDays('USER_CONTEXT_MENU_COMMAND_INTERACTION', numberOfDays),
            messageContextMenus: await this.stats.countStatsPerDays('MESSAGE_CONTEXT_MENU_COMMAND_INTERACTION', numberOfDays),
        }

        const body = []
        for (let i = 0; i < numberOfDays; i++) {
            body.push({
                date: commandsUsage.slashCommands[i].date,
                slashCommands: commandsUsage.slashCommands[i].count,
                simpleCommands: commandsUsage.simpleCommands[i].count,
                contextMenus: commandsUsage.userContextMenus[i].count + commandsUsage.messageContextMenus[i].count
            })
        }

        return body
    }

    @Get('/commands/top')
    async topCommands() {

        const topCommands = await this.stats.getTopCommands()

        return topCommands
    }

    @Get('/users/activity')
    async usersActivity() {

        const usersActivity = await this.stats.getUsersActivity()

        return usersActivity
    }

    @Get('/guilds/top')
    async topGuilds() {

        const topGuilds = await this.stats.getTopGuilds()

        return topGuilds
    }

    @Get('/usersAndGuilds')
    async usersAndGuilds(@QueryParam('numberOfDays', { type: Number }) numberOfDays: number = 7) {

        return {
            activeUsers: await this.stats.countStatsPerDays('TOTAL_ACTIVE_USERS', numberOfDays),
            users: await this.stats.countStatsPerDays('TOTAL_USERS', numberOfDays),
            guilds: await this.stats.countStatsPerDays('TOTAL_GUILDS', numberOfDays),
        }
    }

}