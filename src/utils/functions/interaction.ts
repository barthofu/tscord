import { SimpleCommandMessage } from "discordx"
import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  Message,
  MessageReaction,
  SelectMenuInteraction,
  User,
  VoiceState,
} from "discord.js"

export const getInteractionType = (interaction: any): string => interaction.constructor.name

export function getUserFromInteraction(interaction: any): User | null {

    const userResolvers = {
        CommandInteraction: (interaction: CommandInteraction) => interaction.user,
        MessageReaction: (interaction: MessageReaction) => interaction.message.author,
        VoiceState: (interaction: VoiceState) => interaction.member?.user,
        Message: (interaction: Message) => interaction.author,
        SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.author,
        ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.member?.user,
        SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.member?.user,
        ButtonInteraction: (interaction: ButtonInteraction) => interaction.member?.user,
    }

    return userResolvers[getInteractionType(interaction) as keyof typeof userResolvers]?.(interaction) || interaction.message?.author
}