import { Get, Middleware, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"

import { BaseController } from "@utils/classes"
import { botOnline } from "@api/middlewares"
import { Stats } from "@services"

@Router({ options: { prefix: '/bot' }})
@Middleware(
    botOnline
)
@injectable()
export class BotController extends BaseController {

    constructor(
        private readonly client: Client,
        private readonly stats: Stats
    ) {
        super()
    }

    @Get('/info')
    async user(ctx: Context) {

        const body = {
            user: this.client.user?.toJSON(),
            stats: await this.stats.getTotalStats()
        }

        this.ok(ctx.response, body)
    }

    @Get('/guilds')
    async guilds(ctx: Context) {

        const body = {
            guilds: this.client.guilds.cache.map(guild => guild.toJSON()),
        }

        this.ok(ctx.response, body)
    }

    @Get('/users')
    async users(ctx: Context) {

        const body = {
            users: this.client.users.cache.map(user => user.toJSON()),
        }

        this.ok(ctx.response, body)
    }
}