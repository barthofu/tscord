import { CommandInteraction } from "discord.js";
import { SimpleCommandMessage } from "discordx";

export const replyToInteraction = async (interaction: CommandInteraction | SimpleCommandMessage, message: string) => {
    if (interaction instanceof CommandInteraction) await interaction.reply(message)
    else if (interaction instanceof SimpleCommandMessage) await interaction.message.reply(message)
}