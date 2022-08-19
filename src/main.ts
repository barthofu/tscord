import 'reflect-metadata'
import 'dotenv/config'

import { container } from 'tsyringe'
import { DIService, Client, tsyringeDependencyRegistryEngine } from 'discordx'
import { importx } from '@discordx/importer'

import { Database, ImagesUpload, ErrorHandler, Logger, WebSocket } from '@services'
import { initDataTable, waitForDependency } from '@utils/functions'
import { Server } from '@api/server'

import { clientConfig } from './client'
import { generalConfig } from '@config'
import { NoBotTokenError } from '@errors'

async function run() {

    // start loading
    const logger = await waitForDependency(Logger)
    console.log('\n')
    logger.startSpinner('Starting...')

    // init the sqlite database
    const db = await waitForDependency(Database)
    await db.initialize()

    // init the client
    DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)
    const client = new Client(clientConfig)
    container.registerInstance(Client, client)

    // init the error handler
    await waitForDependency(ErrorHandler)

    // import all the commands and events
    await importx(__dirname + "/{events,commands,api}/**/*.{ts,js}")
        
    // init the data table if it doesn't exist
    await initDataTable()

    // log in with the bot token
    if (!process.env.BOT_TOKEN) throw new NoBotTokenError()
    await client.login(process.env.BOT_TOKEN)

    // start the api server
    const server = await waitForDependency(Server)
    await server.start()

    // connect to the dashboard websocket
    const webSocket = await waitForDependency(WebSocket)
    await webSocket.init(client.user?.id || null)

    // upload images to imgur if configured
    if (process.env.IMGUR_CLIENT_ID && generalConfig.automaticUploadImagesToImgur) {
        const imagesUpload = await waitForDependency(ImagesUpload)
        await imagesUpload.syncWithDatabase()
    }    
}

run()