import { Logger } from "@services"
import { Context, Next } from "koa"
import { container } from "tsyringe"

const logger = container.resolve(Logger)

export function globalLog(ctx: Context, next: Next) {

    // don't log anything if the request has a `logIgnore` query params
    if (!ctx.query.logIgnore) {

        logger.log(
            'info',
            `global logger - request: ${ctx.url}`,
            true
        )
    }

    return next()
}