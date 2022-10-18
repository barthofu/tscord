import { Inject, PlatformAcceptMimesMiddleware, PlatformApplication } from "@tsed/common"
import { PlatformExpress } from "@tsed/platform-express"
import '@tsed/swagger'
import { singleton } from "tsyringe"

import * as controllers from "@api/controllers"
import { Log } from "@api/middlewares"
import { PluginsManager } from "@services"

@singleton()
export class Server {

    @Inject() app: PlatformApplication

    constructor(
        private readonly pluginsManager: PluginsManager
    ) {}

    $beforeRoutesInit() {
        this.app
            .use(Log)
            .use(PlatformAcceptMimesMiddleware)

        return null
    }

    async start() {
        const platform = await PlatformExpress.bootstrap(Server, {
            rootDir: __dirname,
            httpPort: parseInt(process.env['API_PORT']) || 4000,
            httpsPort: false,
            acceptMimes: ['application/json'],
            mount: {
                '/': [...Object.values(controllers), ...this.pluginsManager.getControllers()]
            },
            swagger: [
                {
                    path: '/docs',
                    specVersion: '3.0.1'
                }
            ],
            logger: {
                level: 'warn',
                logRequest: false,
                disableRoutesSummary: true
            }
        })

        await platform.listen()
    }
}