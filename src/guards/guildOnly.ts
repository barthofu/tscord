import { CommandInteraction } from 'discord.js'
import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { L, getLocaleFromInteraction } from '@i18n';
import { detectLocale } from 'src/i18n/i18n-util'

/**
 * Prevent the command from running on DM
 */
export const guildOnly: GuardFunction<CommandInteraction | SimpleCommandMessage> = (arg, client, next) => {

    // const locale = detectLocale('en')
    const locale = getLocaleFromInteraction(arg)
    const localizedReplyMessage = L[locale].GUARDS.GUILD_ONLY()

    if (arg instanceof CommandInteraction) {
        if (arg.inGuild()) return next()
        else arg.reply(localizedReplyMessage);
    }
    else if (arg instanceof SimpleCommandMessage) {
        if (arg.message.guild) return next()
        else arg.message.reply(localizedReplyMessage);
    }
}
