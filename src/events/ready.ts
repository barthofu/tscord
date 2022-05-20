import { Client, Discord, Once } from 'discordx'

@Discord()
export default class {

    @Once('ready')
    async ready(rawClient: Client | Client[]) {

        const client: Client = rawClient instanceof Array ? rawClient[0] : rawClient

        // Make sure all guilds are cached
        await client.guilds.fetch()

        // Synchronize applications commands with Discord
        //if (process.env.NODE_ENV === 'production') await client.initGlobalApplicationCommands() 
        await client.initApplicationCommands({
            global: {
                disable: {
                    delete: true
                }
            }
        })

        // Synchronize applications command permissions with Discord
        await client.initApplicationPermissions()
    }
}