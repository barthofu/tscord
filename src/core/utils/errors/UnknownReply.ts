import { CommandInteraction } from "discord.js"

import { getLocaleFromInteraction, L } from "@i18n"
import { BaseError } from "@utils/classes"
import { simpleErrorEmbed } from "@utils/functions"

export class UnknownReplyError extends BaseError {

    private interaction: CommandInteraction

    constructor(interaction: CommandInteraction, message?: string) {
        
        super(message)

        this.interaction = interaction
    }

    handle() {

        const locale = getLocaleFromInteraction(this.interaction)
        simpleErrorEmbed(this.interaction, L[locale]['ERRORS']['UNKNOWN']())
    }
}