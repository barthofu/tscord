import { CommandInteraction } from 'discord.js'
import { GuardFunction, SimpleCommandMessage } from 'discordx'
import { L, getLocaleFromInteraction } from '@i18n';

/**
 * Prevent the command from running on DM
 */
export const GuildOnly: GuardFunction<
    | CommandInteraction 
    | SimpleCommandMessage
> = (arg, client, next) => {

    const locale = getLocaleFromInteraction(arg),
          localizedReplyMessage = L[locale].GUARDS.GUILD_ONLY()

    if (arg instanceof CommandInteraction) {
        if (arg.inGuild()) return next()
        else arg.reply(localizedReplyMessage);
    }
    else if (arg instanceof SimpleCommandMessage) {
        if (arg.message.guild) return next()
        else arg.message.reply(localizedReplyMessage);
    }
    else return next()
}
