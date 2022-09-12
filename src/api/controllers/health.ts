import { Data } from "@entities"
import { Database, Stats } from "@services"
import { BaseController } from "@utils/classes"
import { Client } from "discordx"
import { Get, JsonController } from "routing-controllers"
import { delay, inject, injectable } from "tsyringe"

@injectable()
@JsonController('/health')
export class HealthController extends BaseController {

    constructor(
        private readonly db: Database,
        @inject(delay(() => Stats)) private readonly stats: Stats,
        @inject(delay(() => Client)) private readonly client: Client,
    ) {
        super()
    }

    @Get('/check')
    async healthcheck() {

        return {
            online: this.client.user?.presence.status !== 'offline',
            uptime: this.client.uptime,
            lastStartup: await this.db.get(Data).get('lastStartup'),
        }
    }

    @Get('/latency')
    async latency() {

        return this.stats.getLatency()
    }

    @Get('/usage')
    async usage() {

        const body = await this.stats.getPidUsage()
    
        return body
    }

    @Get('/host')
    async host() {

        const body = await this.stats.getHostUsage()

        return body
    }
}