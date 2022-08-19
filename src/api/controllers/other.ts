import { injectable } from "tsyringe"
import { Get, Router } from "@discordx/koa"
import { Context } from "koa"

import { BaseController } from "@utils/classes"

@Router()
@injectable()
export class HealthController extends BaseController {

    @Get('/')
    async index(ctx: Context) {

        this.ok(ctx, 'API server is running')
    }
}