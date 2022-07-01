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

    @Get('/healthcheck')
    async healthcheck(ctx: Context) {

        const body = {
            online: this.client.user?.presence.status !== "offline",
            uptime: this.client.uptime,
            lastStartup: await this.db.getRepo(Data).get('lastStartup'),
        }

        this.ok(ctx.response, body)
    }
}