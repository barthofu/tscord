import { BaseError } from "@utils/classes"
import { snake } from "case"

export class InvalidOptionName extends BaseError {

    constructor(nameOption: string) {
        super(`Name option must be all lowercase with no spaces. '${nameOption}' should be '${snake(nameOption)}'`)
    }

    handle() {

        this.logger.console(this.message, 'error')
        this.kill()
    }
}