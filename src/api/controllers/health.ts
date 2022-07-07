import { Get, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"
import pidusage from "pidusage"
import osu from 'node-os-utils'

import { Database } from "@services"
import { Data } from "@entities"
import { BaseController } from "@utils/classes"

@Router({ options: { prefix: "/health" }})
@injectable()
export class HealthController extends BaseController {

    private _totalHostMemoryMb: number = osu.mem.totalMem()

    constructor(
        private readonly client: Client,
        private readonly db: Database
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

        const pidUsage = await pidusage(process.pid)

        const body = {
            ...pidUsage,
            memory: {
                usedInMb: pidUsage.memory / (1024 * 1024),
                percentage: pidUsage.memory / this._totalHostMemoryMb * 100
            },
        }

        this.ok(ctx.response, body)
    }

    @Get('/host')
    async host(ctx: Context) {

        const body = {
            cpu: await osu.cpu.usage(),
            memory: await osu.mem.info(),
            os: await osu.os.oos(),
            uptime: await osu.os.uptime(),
            hostname: await osu.os.hostname(),
            platform: await osu.os.platform()
            // drive: osu.drive.info(),
        }

        this.ok(ctx.response, body)
    }
}