import 'reflect-metadata'
import 'dotenv/config'

import { container } from 'tsyringe'
import { MikroORM } from '@mikro-orm/core'

import { Client } from '@core/Client'
import { Database } from '@core/Database'

async function run() {

    // init the sqlite database
    const db = container.resolve(Database)
    await db.initialize()

    // init the client
    const client = container.resolve(Client)

    // run the client
    client.start()
}

run()