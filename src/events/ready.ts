import { Discord, Once } from 'discordx'
import Client from '../core/Client.js'

@Discord()
export class Ready {

    @Once('ready')
    async ready() {

        // Make sure all guilds are cached
        await Client.bot.guilds.fetch()

        // Synchronize applications commands with Discord
        await Client.bot.initApplicationCommands()

        // Synchronize applications command permissions with Discord
        await Client.bot.initApplicationPermissions()
    }
}