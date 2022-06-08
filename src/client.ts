import { Intents } from 'discord.js'

import { Maintenance, NotBot } from '@guards'

import config from '../config.json'

export const clientConfig = {
    
    // to only use global commands (use @Guild for specific guild command), comment this line
    botGuilds: process.env.NODE_ENV === 'development' ? [process.env.TEST_GUILD_ID] : undefined,
  
    // discord intents
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  
    // debug logs are disabled in silent mode
    silent: !config.logs.debug,

    guards: [
        NotBot,
        Maintenance
    ],
  
    // configuration for @SimpleCommand
    simpleCommand: {
      prefix: config.simpleCommandsPrefix,
    }
    
}