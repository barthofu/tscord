import { Get, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"

import { Database } from "@services"
import { Data } from "@entities"
import { BaseController } from "@utils/classes"

@Router()
@injectable()
export class BotController extends BaseController {

    constructor(
        private readonly client: Client,
        private readonly db: Database
    ) {
        super()
    }

    @Get('/bot/healthcheck')
    async healthcheck(ctx: Context) {

        const body = {
            online: this.client.user?.presence.status === "online",
            uptime: this.client.uptime,
            lastStartup: await this.db.getRepo(Data).get('lastStartup'),
        }

        this.ok(ctx.response, body)
    }

    @Get('/bot/user')
    async user(ctx: Context) {

        const body = {
            user: this.client.user?.toJSON(),
        }

        this.ok(ctx.response, body)
    }
}