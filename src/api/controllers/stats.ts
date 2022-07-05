import { Get, Middleware, Router } from "@discordx/koa"
import { Context } from "koa"

import { BaseController } from "@utils/classes"
import { injectable } from "tsyringe"
import { Stats } from "@services"
import { authenticated } from "@api/middlewares"

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

        const body = {
            stats: await this.stats.getTotalStats()
        }

        this.ok(ctx.response, body)
    }
}