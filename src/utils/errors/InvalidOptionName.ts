import { BaseError } from "@utils/classes"
import { lower } from "case"

export class InvalidOptionName extends BaseError {

    constructor(nameOption: string) {
        super(`Name option must be all lowercase. '${nameOption}' should be '${lower(nameOption)}'`)
    }

    handle() {

        this.logger.console('error', this.message)
        process.exit(1)
    }
}