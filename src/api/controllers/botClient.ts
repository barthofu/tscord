import { Get, Router } from "@discordx/koa"
import { BaseController } from "@utils/classes"
import { Context } from "koa"

@Router()
export class BotClientController extends BaseController {

    @Get('/bot/info')
    async info(ctx: Context) {

        this.ok(ctx.response, "a")
    }
}