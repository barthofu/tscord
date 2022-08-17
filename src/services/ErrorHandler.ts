import { singleton } from 'tsyringe'
import { parse, StackFrame } from 'stacktrace-parser'

import { Logger } from '@services'
import { BaseError } from '@utils/classes'

@singleton()
export class ErrorHandler {

    constructor(
        private logger: Logger
    ) {

        // Catch all exeptions
        process.on('uncaughtException', (error: Error, origin: string) => {

            // stop in case of unhandledRejection
            if (origin === 'unhandledRejection') return

            // if instance of BaseError, call `handle` method
            if (error instanceof BaseError) return error.handle()

            // if the error is not a instance of BaseError
            const trace = parse(error.stack || '')
            if (trace[0]) this.logger.log(
                'error', 
                `Exception : ${error.message}\n${trace.map((frame: StackFrame) => `\t> ${frame.file}:${frame.lineNumber}`).join('\n')}`,
                true    
            )
            else this.logger.log(
                'error', 
                'An error as occured in a unknow file\n\t> ' + error.message,
                true
            )
        })

        // catch all Unhandled Rejection (promise)
        process.on('unhandledRejection', (error: Error | any, promise: Promise<any>) => {

            // if instance of BaseError, call `handle` method
            if(error instanceof BaseError) return error.handle()

            // if the error is not a instance of BaseError
            const trace = parse(error.stack || '')
            if (trace[0]) this.logger.log(
                'error', 
                `Unhandled rejection : ${error.message}\n${trace.map((frame: StackFrame) => `\t> ${frame.file}:${frame.lineNumber}`).join('\n')}`,
                true    
            )
            else this.logger.log(
                'error', 
                'An unhandled rejection as occured in a unknow file\n\t> ' + error,
                true
            )
        })
    }
}