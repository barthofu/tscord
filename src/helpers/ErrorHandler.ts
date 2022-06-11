import { singleton } from 'tsyringe'

import { Logger } from '@helpers'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { getLocaleFromInteraction, L } from '@i18n'
import { simpleErrorEmbed } from '@utils/functions/embeds'

@singleton()
export class ErrorHandler {

    constructor(
        private logger: Logger
    ) {}

    async unknownErrorReply(interaction: CommandInteraction) {

        const locale = getLocaleFromInteraction(interaction)

        simpleErrorEmbed(interaction, L[locale]['ERRORS']['UNKNOWN']())
    }
}