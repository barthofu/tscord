import { Client } from 'discordx'

import { Once, Discord } from '@decorators'

@Discord()
export default class Test {

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
    }
}