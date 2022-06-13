import { CommandInteraction, MessageEmbed } from "discord.js"

/**
 * Send a simple success embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export const simpleSuccessEmbed = (interaction: CommandInteraction, message: string) => {

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`✅ ${message}`)

    interaction.reply({ embeds: [embed] })
}

/**
 * Send a simple error embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export const simpleErrorEmbed = (interaction: CommandInteraction, message: string) => {

    const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`❌ ${message}`)

    interaction.reply({ embeds: [embed] })
}