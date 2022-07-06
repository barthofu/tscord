import 'reflect-metadata'
import 'dotenv/config'

import { container } from 'tsyringe'
import { DIService, Client } from 'discordx'
import { importx } from '@discordx/importer'

import { Database, ImagesUpload, ErrorHandler, Logger } from '@services'
import { initDataTable } from '@utils/functions'
import { Server } from '@api/server'

import { clientConfig } from './client'
import { generalConfig } from '@config'
import { NoBotTokenError } from '@errors'

async function run() {

    // start loading
    const logger = container.resolve(Logger)
    console.log('\n')
    logger.startSpinner('Starting...')

    // init the sqlite database
    const db = container.resolve(Database)
    await db.initialize()

    // init the client
    DIService.container = container
    const client = new Client(clientConfig)
    container.registerInstance(Client, client)

    // init the error handler
    container.resolve(ErrorHandler)

    // import all the commands and events
    await importx(__dirname + "/{events,commands,api}/**/*.{ts,js}")
        
    // init the data table if it doesn't exist
    await initDataTable()

    // log in with the bot token
    if (!process.env.BOT_TOKEN) throw new NoBotTokenError()
    await client.login(process.env.BOT_TOKEN)

    // upload images to imgur if configured
    if (process.env.IMGUR_CLIENT_ID && generalConfig.automaticUploadImagesToImgur) {
        container.resolve(ImagesUpload).syncWithDatabase()
    }

    // start the api server
    await container.resolve(Server).start()
}

run()