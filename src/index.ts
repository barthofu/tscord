import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()
import { Client } from 'discordx'
import { Intents } from 'discord.js'

const client = new Client({
  botId: "test",
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  silent: false,
});
  
client.on("ready", async () => {

  console.log(">> Bot started");

  await client.initApplicationCommands();
  await client.initApplicationPermissions();
});

client.login(process.env.TOKEN);