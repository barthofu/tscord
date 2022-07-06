import { CommandInteraction } from "discord.js"

import { getLocaleFromInteraction, L } from '@i18n'
import { simpleErrorEmbed } from '@utils/functions/embeds'
import { BaseError } from "@utils/classes"
import { container, inject, injectable } from "tsyringe"
import { Logger } from "@services"

export class NoBotTokenError extends BaseError {

    constructor() {
        
        super('Could not find BOT_TOKEN in your environment')
    }

    public handle() {

        this.logger.console('error', this.message)
        process.exit(1)
    }
}