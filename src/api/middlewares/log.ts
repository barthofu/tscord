import chalk from "chalk"
import { Middleware, Context, PlatformContext } from "@tsed/common"

import { Logger } from "@services"
import { resolveDependency, traceMiddleware } from "@utils/functions"

@Middleware()
export class Log {

    private logger: Logger

    constructor() {
        resolveDependency(Logger).then((logger) => {
            this.logger = logger
        })
    }

    async use(@Context() $ctx: PlatformContext) {
        // wrap the execution of the middleware in a span for the current context
        await traceMiddleware(this, $ctx, async (span) => {
            // set the 'logIgnore' attribute to the span
            span?.setAttribute('logIgnore', !!$ctx.request.query.logIgnore);

            // don't log anything if the request has a `logIgnore` query param
            if (!$ctx.request.query.logIgnore) {

                const { method, url } = $ctx.request

                const message = `(API) ${method} - ${url}`
                const chalkedMessage = `(${chalk.bold.white('API')}) ${chalk.bold.green(method)} - ${chalk.bold.blue(url)}`

                this.logger.console(chalkedMessage)
                this.logger.file(message)
                
            } else {
                delete $ctx.request.query.logIgnore
            }
        });
    }

}