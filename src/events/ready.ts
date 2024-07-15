import { Client } from 'discordx'

import { generalConfig } from '@/configs'
import { Discord, Injectable, Once, Schedule } from '@/decorators'
import { Data } from '@/entities'
import { Database, Logger, Scheduler, Store } from '@/services'
import { resolveDependency, syncAllGuilds } from '@/utils/functions'

@Discord()
@Injectable()
export default class ReadyEvent {

	constructor(
		private db: Database,
		private logger: Logger,
		private scheduler: Scheduler,
		private store: Store
	) { }

	private activityIndex = 0

	@Once('ready')
	async readyHandler([client]: [Client]) {
		// make sure all guilds are cached
		await client.guilds.fetch()

		// synchronize applications commands with Discord
		await client.initApplicationCommands()

		// change activity
		await this.changeActivity()

		// update last startup time in the database
		await this.db.get(Data).set('lastStartup', Date.now())

		// start scheduled jobs
		this.scheduler.startAllJobs()

		// log startup
		await this.logger.logStartingConsole()

		// synchronize guilds between discord and the database
		await syncAllGuilds(client)

		// the bot is fully ready
		this.store.update('ready', e => ({ ...e, bot: true }))
	}

	@Schedule('*/15 * * * * *') // cycle every 15 seconds
	async changeActivity() {
		const client = await resolveDependency(Client)
		const activity = generalConfig.activities[this.activityIndex]
		const activityType = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'CUSTOM', 'COMPETING'].indexOf(activity.type)

		client.user?.setPresence({
			status: activity.status,
			activities: [{
				name: activity.name,
				type: activityType,
				url: activity.url || undefined,
			}],
		})

		if (++this.activityIndex === generalConfig.activities.length) {
			this.activityIndex = 0
		}
	}

}
