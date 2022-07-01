import { Get, Middleware, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"

import { BaseController } from "@utils/classes"
import { botOnline } from "@api/middlewares"

@Router({ options: { prefix: '/bot' }})
@Middleware(
    botOnline
)
@injectable()
export class BotController extends BaseController {

    constructor(
        private readonly client: Client,
    ) {
        super()
    }

    @Get('/user')
    async user(ctx: Context) {

        const body = {
            user: this.client.user?.toJSON(),
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
}