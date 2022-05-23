import { SimpleCommandMessage } from "discordx"
import {
    CommandInteraction,
	ButtonInteraction,
	ContextMenuInteraction,
    ModalSubmitInteraction,
	SelectMenuInteraction,
	Message,
	VoiceState,
	MessageReaction,
	User
} from "discord.js"
import { APIUser } from "discord-api-types/v9"

type allInteractionTypes = CommandInteraction | SimpleCommandMessage | ButtonInteraction | ContextMenuInteraction | SelectMenuInteraction | ModalSubmitInteraction
type other = Message | VoiceState | MessageReaction

const resolvers = {

	user: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.user,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.author,
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.member?.user,
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.member?.user,
		SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.member?.user,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.member?.user,

		Message: (interaction: Message) => interaction.author,
		VoiceState: (interaction: VoiceState) => interaction.member?.user,
		MessageReaction: (interaction: MessageReaction) => interaction.message.author,

		fallback: (interaction: any) => interaction?.message?.author,
	},

	channel: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.channel,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.channel,
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.channel,
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.channel,
		SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.channel,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.channel,

		fallback: (interaction: any) => interaction?.message?.channel
	},

	commandName: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.commandName,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.name,

		fallback: (_: any) => ''
	}
}

export const resolveUser = (interaction: allInteractionTypes | other) => {
	return resolvers.user[interaction.constructor.name as keyof typeof resolvers.user]?.(interaction) || resolvers.user['fallback'](interaction)
}

export const resolveChannel = (interaction: allInteractionTypes) => {
	return resolvers.channel[interaction.constructor.name as keyof typeof resolvers.channel]?.(interaction) || resolvers.channel['fallback'](interaction)
}

export const commandName = (interaction: CommandInteraction | SimpleCommandMessage) => {
	resolvers.commandName[interaction.constructor.name as keyof typeof resolvers.commandName]?.(interaction) || resolvers.commandName['fallback'](interaction)
}