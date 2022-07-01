import { Get, Router } from "@discordx/koa"
import { Context } from "koa"

import { BaseController } from "@utils/classes"
import { injectable } from "tsyringe"
import { Stats } from "@services"

@Router({ options: { prefix: '/stats' }})
@injectable()
export class StatsController extends BaseController {

    constructor(
        private readonly stats: Stats,
    ) {
        super()
    }

    @Get('/getTotals')
    async info(ctx: Context) {

        const body = {
            stats: await this.stats.getTotalStats()
        }

        this.ok(ctx.response, body)
    }
}