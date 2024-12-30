import process from 'node:process'

import { Controller, Get, UseBefore } from '@tsed/common'
import { Client, Serialized, ShardingManager } from 'discord.js'
import osu from 'node-os-utils'
import pidusage from 'pidusage'

import { Data } from '@/entities'
import { Database, Logger, Stats } from '@/services'
import { BaseController } from '@/utils/classes'
import { isInMaintenance, resolveDependencies } from '@/utils/functions'

import { DevAuthenticated } from '../middlewares/devAuthenticated'

@Controller('/health')
export class HealthController extends BaseController {

	private manager: ShardingManager
	private logger: Logger
	private db: Database

	constructor() {
		super()

		resolveDependencies([ShardingManager, Database, Logger]).then(([manager, db, logger]) => {
			this.manager = manager
			this.logger = logger
			this.db = db
		})
	}

	@Get('/check')
	async healthcheck() {
		return {
			...(await this.manager.broadcastEval(async (client: Client) => {
				return {
					online: client.user?.presence.status !== 'offline',
					uptime: client.uptime,
				}
			}, { shard: 0 })),
			lastStartup: await this.db.get(Data).get('lastStartup'),
		}
	}

	@Get('/latency')
	async latency() {
		const latencies = await this.manager.broadcastEval(async (_) => {
			const { Stats } = await import('@/services')
			const { resolveDependency } = await import('@/utils/functions')
			const stats = await resolveDependency(Stats)

			return stats.getLatency()
		})

		// average latency
		return latencies.reduce((acc, curr) => acc + curr.ping, 0) / latencies.length
	}

	@Get('/usage')
	async usage() {
		const pidUsages = await this.manager.broadcastEval(async (_) => {
			const { Stats } = await import('@/services')
			const { resolveDependency } = await import('@/utils/functions')
			const stats = await resolveDependency(Stats)

			return stats.getPidUsage()
		})
		const pidUsage = await pidusage(process.pid)
		pidUsages.push({
			...pidUsage,
			cpu: pidUsage.cpu.toFixed(1),
			memory: {
				usedInMb: (pidUsage.memory / (1024 * 1024)).toFixed(1),
				percentage: (pidUsage.memory / osu.mem.totalMem() * 100).toFixed(1),
			},
		})

		// average pid usage
		return {
			cpu: pidUsages.reduce((acc, curr) => acc + Number(curr.cpu), 0) / pidUsages.length,
			memory: {
				usedInMb: pidUsages.reduce((acc, curr) => acc + Number(curr.memory.usedInMb), 0) / pidUsages.length,
				percentage: pidUsages.reduce((acc, curr) => acc + Number(curr.memory.percentage), 0) / pidUsages.length,
			},
			ppid: 0, // Not used by dashboard (need to change it later)
			pid: 0, // Not used by dashboard (need to change it later)
			ctime: 0, // Not used by dashboard (need to change it later)
			elapsed: 0, // Not used by dashboard (need to change it later)
			timestamp: 0, // Not used by dashboard (need to change it later)
		}
	}

	@Get('/host')
	async host() {
		return {
			cpu: await osu.cpu.usage(),
			memory: await osu.mem.info(),
			os: await osu.os.oos(),
			uptime: await osu.os.uptime(),
			hostname: await osu.os.hostname(),
			platform: await osu.os.platform(),
		} // host not pid
	}

	@Get('/monitoring')
	@UseBefore(
		DevAuthenticated
	)
	async monitoring() {
		const usages = await this.manager.broadcastEval(async (client: Client) => {
			const { Stats } = await import('@/services')
			const { resolveDependency } = await import('@/utils/functions')
			const stats = await resolveDependency(Stats)

			return {
				uptime: client.uptime,
				pid: await stats.getPidUsage(),
				latency: await stats.getLatency() as { ping: number | null },
			}
		})

		const pidUsage = await pidusage(process.pid)
		usages.splice(0, 0, {
			uptime: null,
			latency: { ping: null },
			pid: {
				...pidUsage,
				cpu: pidUsage.cpu.toFixed(1),
				memory: {
					usedInMb: (pidUsage.memory / (1024 * 1024)).toFixed(1),
					percentage: (pidUsage.memory / osu.mem.totalMem() * 100).toFixed(1),
				},
			},
		})

		const uptimes = usages.map(usage => usage.uptime).filter(el => el !== null)
		const latencies = usages.map(usage => usage.latency).filter(el => el !== null)
		const pidUsages = usages.map(usage => usage.pid)

		const body = {
			botStatus: {
				online: true,
				uptime: (uptimes as number[]).reduce((acc, curr) => acc + curr, 0) / uptimes.length,
				maintenance: await isInMaintenance(),
			},
			host: {
				cpu: await osu.cpu.usage(),
				memory: await osu.mem.info(),
				os: await osu.os.oos(),
				uptime: await osu.os.uptime(),
				hostname: await osu.os.hostname(),
				platform: await osu.os.platform(),
			}, // host not pid
			pid: {
				cpu: pidUsages.reduce((acc, curr) => acc + Number(curr.cpu), 0) / pidUsages.length,
				memory: {
					usedInMb: pidUsages.reduce((acc, curr) => acc + Number(curr.memory.usedInMb), 0) / pidUsages.length,
					percentage: pidUsages.reduce((acc, curr) => acc + Number(curr.memory.percentage), 0) / pidUsages.length,
				},
				ppid: 0, // Not used by dashboard (need to change it later)
				pid: 0, // Not used by dashboard (need to change it later)
				ctime: 0, // Not used by dashboard (need to change it later)
				elapsed: 0, // Not used by dashboard (need to change it later)
				timestamp: 0, // Not used by dashboard (need to change it later)
			},
			latency: (latencies as unknown as { ping: number }[]).reduce((acc, curr) => acc + curr.ping, 0) / latencies.length,
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
