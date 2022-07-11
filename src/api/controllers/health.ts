import { Get, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"

import { Database, Stats } from "@services"
import { Data } from "@entities"
import { BaseController } from "@utils/classes"

@Router({ options: { prefix: "/health" }})
@injectable()
export class HealthController extends BaseController {

    constructor(
        private readonly client: Client,
        private readonly db: Database,
        private readonly stats: Stats
    ) {
        super()
    }

    @Get('/check')
    async healthcheck(ctx: Context) {

        const body = {
            online: this.client.user?.presence.status !== "offline",
            uptime: this.client.uptime,
            lastStartup: await this.db.getRepo(Data).get('lastStartup'),
        }

        this.ok(ctx.response, body)
    }

    @Get('/usage')
    async usage(ctx: Context) {

        const body = await this.stats.getPidUsage()

        this.ok(ctx.response, body)
    }

    @Get('/host')
    async host(ctx: Context) {

        const body = await this.stats.getHostUsage()

        this.ok(ctx.response, body)
    }
}