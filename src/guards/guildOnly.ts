import { CommandInteraction } from 'discord.js'
import { GuardFunction, SimpleCommandMessage } from 'discordx'


/**
 * Prevent the command from running on DM
 */
export const guildOnly: GuardFunction<CommandInteraction | SimpleCommandMessage> = (arg, client, next) => {

    if (arg instanceof CommandInteraction) {
        if (arg.inGuild()) return next()
        else arg.reply("This command can only be used in a server.");
    }
    else if (arg instanceof SimpleCommandMessage) {
        if (arg.message.guild) return next()
        else arg.message.reply("This command can only be used in a server.");
    }
}
