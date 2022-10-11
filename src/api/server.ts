import * as controllers from '@api/controllers'
import { Log } from '@api/middlewares'
import { Configuration, Inject, PlatformAcceptMimesMiddleware, PlatformApplication } from '@tsed/common'
import { PlatformExpress } from '@tsed/platform-express'
import '@tsed/swagger'
import { singleton } from 'tsyringe'

export const rootDir = __dirname

@Configuration({
    rootDir,
    httpPort: parseInt(process.env['API_PORT']) || 4000,
    httpsPort: false,
    acceptMimes: ['application/json'],
    mount: {
        '/': Object.values(controllers)
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
@singleton()
export class Server {

    @Inject() app: PlatformApplication

    $beforeRoutesInit() {
        this.app
            .use(Log)
            .use(PlatformAcceptMimesMiddleware)

        return null
    }

    async start() {
        const platform = await PlatformExpress.bootstrap(Server, {})

        await platform.listen()
    }
}