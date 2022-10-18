import 'dotenv/config'
import 'reflect-metadata'

import { importx } from "@discordx/importer"
import discordLogs from "discord-logs"
import { Client, DIService, tsyringeDependencyRegistryEngine } from "discordx"
import { container } from "tsyringe"

import { Server } from "@api/server"
import { apiConfig, generalConfig, websocketConfig } from "@config"
import { NoBotTokenError } from "@errors"
import { Database, ErrorHandler, ImagesUpload, Logger, PluginsManager, WebSocket } from "@services"
import { initDataTable, resolveDependency } from "@utils/functions"
import { clientConfig } from "./client"

async function run() {

    // init logger, pluginsmanager and error handler
    const logger = await resolveDependency(Logger)

    // init error handler
    await resolveDependency(ErrorHandler)
    
    // init plugins 
    const pluginManager = await resolveDependency(PluginsManager)

    // load plugins and import translations
    await pluginManager.loadPlugins()
    await pluginManager.syncTranslations()

    // strart spinner
    console.log('\n')
    logger.startSpinner('Starting...')

    // init the sqlite database
    const db = await resolveDependency(Database)
    await db.initialize()

    // init the client
    DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)
    const client = new Client(clientConfig)

    // Load all new events
    discordLogs(client, { debug: false })
    container.registerInstance(Client, client)

    // import all the commands and events
    await importx(__dirname + "/{events,commands}/**/*.{ts,js}")
    await pluginManager.importCommands()
    await pluginManager.importEvents()
        
    // init the data table if it doesn't exist
    await initDataTable()

    // init plugins services
    await pluginManager.initServices()

    // init the plugin main file
    await pluginManager.execMains()

    // log in with the bot token
    if (!process.env.BOT_TOKEN) throw new NoBotTokenError()
    client.login(process.env.BOT_TOKEN)
    .then(async () => {

        // start the api server
        if (apiConfig.enabled) {
            const server = await resolveDependency(Server)
            await server.start()
        }

        // connect to the dashboard websocket
        if (websocketConfig.enabled) {
            const webSocket = await resolveDependency(WebSocket)
            await webSocket.init(client.user?.id || null)
        }

        // upload images to imgur if configured
        if (process.env.IMGUR_CLIENT_ID && generalConfig.automaticUploadImagesToImgur) {
            const imagesUpload = await resolveDependency(ImagesUpload)
            await imagesUpload.syncWithDatabase()
        }
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
}

run()