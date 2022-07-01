import { CommandInteraction } from 'discord.js'
import { singleton } from 'tsyringe'

import { Logger } from '@services'
import { BaseError } from '@utils/classes'


@singleton()
export class ErrorHandler {

    constructor(
        private logger: Logger
    ) {
        // Catch all exeptions
        process.on('uncaughtException', (error: Error, origin: string) => {
            // Stop if is unhandledRejection
            if(origin === "unhandledRejection") return;

            // If instance of BaseError, call `handle` method
            if(error instanceof BaseError) return error.handle();

            // If the error is not a instance of BaseError
            this.logger.log("error", `Uncaught Exception : ${error.message}`);
        });

        // Catch all Unhandled Rejection (promise)
        process.on('unhandledRejection', (error: Error | any, promise: Promise<any>) => {
            // If instance of BaseError, call `handle` method
            if(error instanceof BaseError) return error.handle();

            // If the error is not a instance of BaseError
            this.logger.log("error", `Unhandled rejection at ${promise}\nreason: ${error.message}`);
        });
    }
}