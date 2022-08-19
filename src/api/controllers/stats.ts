import { injectable } from "tsyringe"
import { Get, Middleware, Router } from "@discordx/koa"
import { Joi } from "koa-context-validator"
import { Context } from "koa"

import { BaseController } from "@utils/classes"
import { Stats } from "@services"
import { authenticated, validator } from "@api/middlewares"

@Router({ options: { prefix: '/stats' }})
@Middleware(
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
    async info(ctx: Context) {

        const totalStats = await this.stats.getTotalStats()

        const body = {
            stats: {
                totalUsers: totalStats.TOTAL_USERS,
                totalGuilds: totalStats.TOTAL_GUILDS,
                totalActiveUsers: totalStats.TOTAL_ACTIVE_USERS,
                totalCommands: totalStats.TOTAL_COMMANDS,
            }
        }

        this.ok(ctx, body)
    }

    @Get('/lastInteraction')
    async lastInteraction(ctx: Context) {

        const lastInteraction = await this.stats.getLastInteraction()

        this.ok(ctx, lastInteraction)
    }

    @Get('/commandsUsage')
    @Middleware(
        validator({
            query: Joi.object().keys({
                numberOfDays: Joi.number().default(7)
            })
        })
    )
    async commandsUsage(ctx: Context) {
        
        const data = <{ numberOfDays: string }>ctx.request.query
        const numberOfDays = parseInt(data.numberOfDays)

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

        this.ok(ctx, body)
    }

    @Get('/topCommands')
    async topCommands(ctx: Context) {

        const topCommands = await this.stats.getTopCommands()

        this.ok(ctx, topCommands)
    }

    @Get('/usersActivity')
    async usersActivity(ctx: Context) {

        const usersActivity = await this.stats.getUsersActivity()

        this.ok(ctx, usersActivity)
    }

    @Get('/topGuilds')
    async topGuilds(ctx: Context) {

        const topGuilds = await this.stats.getTopGuilds()

        this.ok(ctx, topGuilds)
    }

    @Get('/usersAndGuilds')
    @Middleware(
        validator({
            query: Joi.object().keys({
                numberOfDays: Joi.number().default(7)
            })
        })
    )
    async usersAndGuilds(ctx: Context) {

        const data = <{ numberOfDays: string }>ctx.request.query
        const numberOfDays = parseInt(data.numberOfDays)

        const body = {
            activeUsers: await this.stats.countStatsPerDays('TOTAL_ACTIVE_USERS', numberOfDays),
            users: await this.stats.countStatsPerDays('TOTAL_USERS', numberOfDays),
            guilds: await this.stats.countStatsPerDays('TOTAL_GUILDS', numberOfDays),
        }

        this.ok(ctx, body)
    }

}