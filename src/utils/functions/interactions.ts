import { CommandInteraction } from "discord.js";
import { SimpleCommandMessage } from "discordx";

/**
 * Abstraction level to reply to either a slash command or a simple command message.
 * @param interaction 
 * @param message 
 */
export const replyToInteraction = async (interaction: CommandInteraction | SimpleCommandMessage, message: string) => {
    if (interaction instanceof CommandInteraction) await interaction.reply(message)
    else if (interaction instanceof SimpleCommandMessage) await interaction.message.reply(message)
}