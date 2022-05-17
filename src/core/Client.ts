import { Client as ClientX } from 'discordx'
import { importx } from '@discordx/importer'
import { Intents } from 'discord.js'

import config from '../../config.json'
import { maintenance, notBot, nsfw } from '@utils/guards'

export default class Client {

    public static bot: ClientX

    static init() {

        this.bot = new ClientX({
    
            // To only use global commands (use @Guild for specific guild command), comment this line
            botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
          
            // Discord intents
            intents: [
              Intents.FLAGS.GUILDS,
              Intents.FLAGS.GUILD_MEMBERS,
              Intents.FLAGS.GUILD_MESSAGES,
              Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
              Intents.FLAGS.GUILD_VOICE_STATES,
            ],
          
            // Debug logs are disabled in silent mode
            silent: config.debugLogs,

            guards: [
                maintenance,
                notBot,
                nsfw
            ],
          
            // Configuration for @SimpleCommand
            simpleCommand: {
              prefix: config.simpleCommandsPrefix,
            },
        })
    }

    static async start() {

        // Let's start the bot!
        await importx(__dirname + "/../{events,commands}/**/*.{ts,js}")

        this.login()
    }

    private static async login() {

        // Log in with your bot token
        if (!process.env.BOT_TOKEN) throw Error("Could not find BOT_TOKEN in your environment")

        await this.bot.login(process.env.BOT_TOKEN)
    }
}