import { Client } from 'discordx'
import { container } from 'tsyringe'

import { Once, Discord, Schedule } from '@decorators'
import { syncAllGuilds } from '@utils/functions'

import { generalConfig } from '@configs'

@Discord()
export default class Ready {

    private activityIndex = 0

    @Once('ready')
    async ready(rawClient: Client | Client[]) {

        const client: Client = rawClient instanceof Array ? rawClient[0] : rawClient

        // make sure all guilds are cached
        await client.guilds.fetch()

        // synchronize applications commands with Discord
        await client.initApplicationCommands({
            global: {
                disable: {
                    delete: false
                }
            }
        })

        // synchronize applications command permissions with Discord
        await client.initApplicationPermissions()

        // syncrhonize guilds between discord and the database
        await syncAllGuilds(client)

        // change activity
        await this.changeActivity()
    }

    @Schedule('*/15 * * * * *') // each 15 seconds
    async changeActivity() {

        const client = container.resolve(Client)

        const activity = generalConfig.activities[this.activityIndex]
        
        activity.text = eval(`new String(\`${activity.text}\`).toString()`)
            
        if (activity.type === 'STREAMING') {
            //streaming activity
            
            client.user?.setStatus('online')
            client.user?.setActivity(activity.text, {
                'url': 'https://www.twitch.tv/discord',
                'type': 'STREAMING'
            })
        } else {
            //other activities
            
            client.user?.setActivity(activity.text, {
                type: activity.type as 'PLAYING' | 'WATCHING' | 'LISTENING' | 'STREAMING'
            })
        }

        this.activityIndex++
        if (this.activityIndex === generalConfig.activities.length) this.activityIndex = 0

    }
}