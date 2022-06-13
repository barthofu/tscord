import { CommandInteraction } from 'discord.js'
import { singleton } from 'tsyringe'

import { Logger } from '@helpers'
import { getLocaleFromInteraction, L } from '@i18n'
import { simpleErrorEmbed } from '@utils/functions/embeds'

@singleton()
export class ErrorHandler {

    constructor(
        private logger: Logger
    ) {}

    /**
     * Automatically handles errors and sends a message to the user using a discord embed.
     * @param interaction
     */
    async unknownErrorReply(interaction: CommandInteraction) {

        const locale = getLocaleFromInteraction(interaction)

        simpleErrorEmbed(interaction, L[locale]['ERRORS']['UNKNOWN']())
    }
}