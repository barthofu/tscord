import { CommandInteraction } from "discord.js"

import { BaseError } from "@utils/classes"

export class UnknownReplyError extends BaseError {

    constructor(interaction: CommandInteraction, message?: string) {
        super(message)
    }

    public handler() {


    }
}