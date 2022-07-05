import { singleton } from 'tsyringe'
import { parse } from 'stacktrace-parser'

import { Logger } from '@services'
import { BaseError } from '@utils/classes'

@singleton()
export class ErrorHandler {

    constructor(
        private logger: Logger
    ) {
        // Ccatch all exeptions
        process.on('uncaughtException', (error: Error, origin: string) => {

            // stop in case of unhandledRejection
            if (origin === "unhandledRejection") return

            // if instance of BaseError, call `handle` method
            if (error instanceof BaseError) return error.handle()

            // if the error is not a instance of BaseError
            const trace = parse(error.stack || "")?.[0]
            if (trace) return this.logger.log("error", `Exception at : ${trace?.file}:${trace?.lineNumber}\n\t> ${error.message}`)

            this.logger.log("error", "An error as occured in a unknow file\n\t> " + error.message)
        })

        // catch all Unhandled Rejection (promise)
        process.on('unhandledRejection', (error: Error | any, promise: Promise<any>) => {

            // if instance of BaseError, call `handle` method
            if(error instanceof BaseError) return error.handle()

            // if the error is not a instance of BaseError
            const trace = parse(error.stack || "")?.[0]
            if(trace) return this.logger.log("error", `Unhandled rejection at ${trace?.file}:${trace?.lineNumber}\n\t> ${error.message}`)

            this.logger.log("error", "An unhandled rejection as occured in a unknow file\n\t> " + error)
        })
    }
}