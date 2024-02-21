import { Controller, Get, UseBefore } from '@tsed/common'
import { Client } from 'discordx'

import { Data } from '@/entities'
import { Database, Logger, Stats } from '@/services'
import { BaseController } from '@/utils/classes'
import { isInMaintenance, resolveDependencies } from '@/utils/functions'

import { DevAuthenticated } from '../middlewares/devAuthenticated'

@Controller('/health')
export class HealthController extends BaseController {

	private client: Client
	private db: Database
	private stats: Stats
	private logger: Logger

	constructor() {
		super()

		resolveDependencies([Client, Database, Stats, Logger]).then(([client, db, stats, logger]) => {
			this.client = client
			this.db = db
			this.stats = stats
			this.logger = logger
		})
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

	@Get('/monitoring')
	@UseBefore(
		DevAuthenticated
	)
	async monitoring() {
		const body = {
			botStatus: {
				online: true,
				uptime: this.client.uptime,
				maintenance: await isInMaintenance(),
			},
			host: await this.stats.getHostUsage(),
			pid: await this.stats.getPidUsage(),
			latency: this.stats.getLatency(),
		}

		return body
	}

	@Get('/logs')
	@UseBefore(
		DevAuthenticated
	)
	async logs() {
		const body = await this.logger.getLastLogs()

		return body
	}

}
