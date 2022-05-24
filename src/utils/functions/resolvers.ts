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
	User,
	Interaction
} from "discord.js"
import { APIUser } from "discord-api-types/v9"
import { ContextMenu } from 'discordx'

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

		fallback: (interaction: any) => null
	},

	channel: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.channel,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.channel,
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.channel,
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.channel,
		SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.channel,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.channel,

		fallback: (interaction: any) => null
	},

	commandName: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.commandName,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.name,
		
		fallback: (_: any) => ''
	},

	action: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.commandName,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.name,
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.customId,
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.commandName,
		SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.customId,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.customId,	
	
		fallback: (_: any) => ''
	}
}

export const resolveUser = (interaction: Interaction) => {
	return resolvers.user[getTypeOfInteraction(interaction) as keyof typeof resolvers.user]?.(interaction) || resolvers.user['fallback'](interaction)
}

export const resolveChannel = (interaction: Interaction) => {
	return resolvers.channel[getTypeOfInteraction(interaction) as keyof typeof resolvers.channel]?.(interaction) || resolvers.channel['fallback'](interaction)
}

export const resolveCommandName = (interaction: CommandInteraction | SimpleCommandMessage) => {
	return resolvers.commandName[interaction.constructor.name as keyof typeof resolvers.commandName]?.(interaction) || resolvers.commandName['fallback'](interaction)
}

export const resolveAction = (interaction: Interaction) => {
	return resolvers.action[getTypeOfInteraction(interaction) as keyof typeof resolvers.action]?.(interaction) || resolvers.action['fallback'](interaction)
}


export const getTypeOfInteraction = (interaction: Interaction) => {
	return interaction.constructor.name
}