import { SimpleCommandMessage } from "discordx"
import {
ButtonInteraction,
	Channel,
CommandInteraction,
ContextMenuInteraction,
Message,
MessageReaction,
SelectMenuInteraction,
User,
VoiceState,
} from "discord.js"

const resolvers = {

	user: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.user,
		MessageReaction: (interaction: MessageReaction) => interaction.message.author,
		VoiceState: (interaction: VoiceState) => interaction.member?.user,
		Message: (interaction: Message) => interaction.author,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.author,
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.member?.user,
		SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.member?.user,
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.member?.user,

		fallback: (interaction: any) => interaction.message?.author,
	},

	channel: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.channel,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.channel,

		fallback: (interaction: any) => interaction.message?.channel
	},

	name: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.commandName,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.name,

		fallback: (_: any) => ''
	}
}

export const getInteractionType = (interaction: any): string => interaction.constructor.name

export const getUserFromInteraction = (interaction: any) => resolvers.user[getInteractionType(interaction) as keyof typeof resolvers.user]?.(interaction) || resolvers.user['fallback'](interaction)
export const getChannelFromInteraction = (interaction: any) => resolvers.channel[getInteractionType(interaction) as keyof typeof resolvers.channel]?.(interaction) || resolvers.channel['fallback'](interaction)

export const getNameOfInteraction = (interaction: any) => resolvers.name[getInteractionType(interaction) as keyof typeof resolvers.name]?.(interaction) || resolvers.name['fallback'](interaction)
