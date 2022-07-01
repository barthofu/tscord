import { Logger } from "@services"
import { Context, Next } from "koa"
import { container } from "tsyringe"

const logger = container.resolve(Logger)

export function globalLog(ctx: Context, next: Next) {

    logger.log(
        'info',
        `global logger - request: ${ctx.url}`,
        true
    )

    return next()
}