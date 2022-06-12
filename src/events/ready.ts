import { Client } from 'discordx'

import { Once, Discord } from '@decorators'
import { syncAllGuilds } from '@utils/functions'

@Discord()
export default class Ready {

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
    }
}