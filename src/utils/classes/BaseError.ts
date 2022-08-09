import { Logger } from "@services"
import { waitForDependency } from "@utils/functions"


export abstract class BaseError extends Error {

    protected logger: Logger

    constructor(message?: string) {
        super(message)
        waitForDependency(Logger).then(logger => {
            this.logger = logger
        })
    }

    handle() {}
}