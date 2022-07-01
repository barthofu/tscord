import { Get, Router } from "@discordx/koa"
import { Context } from "koa"

import { BaseController } from "@utils/classes"
import { injectable } from "tsyringe"
import { Stats } from "@services"

@Router()
@injectable()
export class StatsController extends BaseController {

    constructor(
        private readonly stats: Stats,
    ) {
        super()
    }

    @Get('/stats/')
    async info(ctx: Context) {

        this.ok(ctx.response, "a")
    }
}