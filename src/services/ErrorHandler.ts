import { Client } from 'discordx'
import { singleton } from 'tsyringe'
import { parse, StackFrame } from 'stacktrace-parser'

import { Logger } from '@services'
import { BaseError } from '@utils/classes'


@singleton()
export class ErrorHandler {

    constructor(
        private logger: Logger,
        private client: Client
    ) {

        // Catch all exeptions
        process.on('uncaughtException', (error: Error, origin: string) => {

            // stop in case of unhandledRejection
            if (origin === 'unhandledRejection') return

            // if instance of BaseError, call `handle` method
            if (error instanceof BaseError) return error.handle()

            // if the error is not a instance of BaseError
            const trace = parse(error.stack || '')
            
            // log the error
            this.logger.logError(error, "Exception", trace);
        })

        // catch all Unhandled Rejection (promise)
        process.on('unhandledRejection', (error: Error | any, promise: Promise<any>) => {

            // if instance of BaseError, call `handle` method
            if(error instanceof BaseError) return error.handle()

            // if the error is not a instance of BaseError
            const trace = parse(error.stack || '')

            // log the error
            this.logger.logError(error, "unhandledRejection", trace);
        })
    }
}