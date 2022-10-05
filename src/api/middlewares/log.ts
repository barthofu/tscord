import { Logger } from "@services"
import chalk from "chalk"
import { NextFunction, Request, Response } from "express"
import { container } from "tsyringe"

const logger = container.resolve(Logger)

export async function log(req: Request, res: Response, next: NextFunction) {

    // don't log anything if the request has a `logIgnore` query param
    if (!req.query.logIgnore) {

        const { method, url } = req

        const message = `(API) ${method} - ${url}`
        const chalkedMessage = `(${chalk.bold.white('API')}) ${chalk.bold.green(method)} - ${chalk.bold.blue(url)}`

        logger.console(chalkedMessage)
        logger.file(message)
        
    } else {
        delete req.query.logIgnore
    }

    return next()
}