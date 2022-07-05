import { Koa } from "@discordx/koa"
import { singleton } from "tsyringe"
import bodyParser from 'koa-bodyparser'

import { globalLog } from "@api/middlewares"
import { Logger } from "@services"

import { apiConfig } from "@config"

@singleton()
export class Server {

    constructor(
        private readonly logger: Logger
    ) {}

    async start() {

        const server = new Koa({
            globalMiddlewares: [
                globalLog
            ]
        })

        server.use(bodyParser())
        
        await server.build()

        server.listen(apiConfig.port, this.listen.bind(this))
    }

    async listen() {

    }

}