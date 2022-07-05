import { Logger } from "@services"
import { container } from "tsyringe"

export abstract class BaseError extends Error {

    protected logger: Logger

    constructor(message?: string) {
        
        super(message)
        this.logger = container.resolve(Logger)
    }

    public handle() {}
}