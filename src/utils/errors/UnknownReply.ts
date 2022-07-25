import { CommandInteraction } from "discord.js"

import { getLocaleFromInteraction, L } from '@i18n'
import { simpleErrorEmbed } from '@utils/functions/embeds'
import { BaseError } from "@utils/classes"

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