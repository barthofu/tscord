export abstract class BaseError extends Error {

    constructor(message?: string) {
        super(message)
    }

    public handle() {}
}