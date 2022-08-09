import { BaseError } from "@utils/classes"

export class NoBotTokenError extends BaseError {

    constructor() {
        super('Could not find BOT_TOKEN in your environment')
    }

    handle() {

        this.logger.console('error', this.message)
        process.exit(1)
    }
}