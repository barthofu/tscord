import { Get, Router } from "@discordx/koa"
import { BaseController } from "@utils/classes"
import { Context } from "koa"

@Router()
export class HealthCheckController extends BaseController {

    @Get('/healthcheck')
    async healthcheck(ctx: Context) {

        this.ok(ctx.response, { message: `hello world` })
    }
}