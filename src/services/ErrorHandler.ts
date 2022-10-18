import { singleton } from "tsyringe"

import { Logger } from "@services"
import { BaseError } from "@utils/classes"

@singleton()
export class ErrorHandler {

    constructor(
        private logger: Logger
    ) {

        // Catch all exceptions
        process.on('uncaughtException', (error: Error, origin: string) => {

            // stop in case of unhandledRejection
            if (origin === 'unhandledRejection') return

            // if instance of BaseError, call `handle` method
            if (error instanceof BaseError) return error.handle()
            
            // log the error
            this.logger.logError(error, "Exception")
        })

        // catch all Unhandled Rejection (promise)
        process.on('unhandledRejection', (error: Error | any, promise: Promise<any>) => {

            // if instance of BaseError, call `handle` method
            if (error instanceof BaseError) return error.handle()

            // log the error
            this.logger.logError(error, "unhandledRejection")
        })
    }
}