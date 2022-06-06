import { Client, Discord, Once } from 'discordx'
import { injectable } from 'tsyringe'

import * as scheduledJobs from '@utils/scheduled'
import { Scheduler } from '@helpers'

@Discord()
@injectable()
export default class {

    constructor(
        private scheduler: Scheduler
    ) {}

    @Once('ready')
    async ready(rawClient: Client | Client[]) {

        const client: Client = rawClient instanceof Array ? rawClient[0] : rawClient

        // Make sure all guilds are cached
        await client.guilds.fetch()

        // Synchronize applications commands with Discord
        await client.initApplicationCommands({
            global: {
                disable: {
                    delete: false
                }
            }
        })

        // Synchronize applications command permissions with Discord
        await client.initApplicationPermissions()

        // Register all scheduled jobs
        Object.values(scheduledJobs).forEach(job => this.scheduler.register(new job))
    }
}