import { container } from "tsyringe"
import chalk from "chalk"
import { Context, Next } from "koa"

import { Logger } from "@services"

const logger = container.resolve(Logger)

export async function globalLog(ctx: Context, next: Next) {

    // don't log anything if the request has a `logIgnore` query params
    if (!ctx.query.logIgnore) {
        const { method, url } = ctx.request

        const message = `(API) ${method} - ${url}`
        const chalkedMessage = `(${chalk.bold.white('API')}) ${chalk.bold.green(method)} - ${chalk.bold.blue(url)}`

        logger.console('info', chalkedMessage)
        logger.file('info', message)
        
    } else {
        delete ctx.query.logIgnore
    }

    return next()
}