import "reflect-metadata"
import 'dotenv/config'

import { container } from 'tsyringe'

import Client from '@core/Client'
import Database from '@core/Database'

async function run() {

    // init the database
    const database = new Database()
    await database.initialize()
    container.registerInstance(Database, new Database())

    // init the client
    const client = new Client()
    client.start()
}

run()