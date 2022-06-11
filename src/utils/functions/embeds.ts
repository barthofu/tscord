import { CommandInteraction, MessageEmbed } from "discord.js"

export const simpleSuccessEmbed = (interaction: CommandInteraction, message: string) => {

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`✅ ${message}`)

    interaction.reply({ embeds: [embed] })
}

export const simpleErrorEmbed = (interaction: CommandInteraction, message: string) => {

    const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`❌ ${message}`)

    interaction.reply({ embeds: [embed] })
}