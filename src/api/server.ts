import { Koa } from "@discordx/koa"
import { singleton } from "tsyringe"

import { globalLog } from "@api/middlewares"
import { Logger } from "@services"

@singleton()
export class Server {

    private readonly port = process.env.PORT || 3000

    constructor(
        private readonly logger: Logger
    ) {}

    async start() {

        const server = new Koa({
            globalMiddlewares: [
                globalLog
            ]
        })

        await server.build()

        server.listen(this.port, this.listen.bind(this))
    }

    async listen() {

        this.logger.log(
            'info',
            `discord api server started on ${this.port}`,
            true
        )
    }

}