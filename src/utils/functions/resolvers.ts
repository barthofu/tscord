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
import { AllInteractions, interactionsStarters } from "@utils/types"

const resolvers = {

	user: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.user,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.author,
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.member?.user,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.member?.user,
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
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.channel,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.channel,
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
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.commandName,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.customId,
		SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.customId,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.customId,	
	
		fallback: (_: any) => ''
	},

	locale: {
		CommandInteraction: (interaction: CommandInteraction) => interaction.locale,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.guild?.preferredLocale ?? 'default',
		ContextMenuInteraction: (interaction: ContextMenuInteraction) => interaction.guild?.preferredLocale ?? 'default',
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.guild?.preferredLocale ?? 'default',
		SelectMenuInteraction: (interaction: SelectMenuInteraction) => interaction.guild?.preferredLocale ?? 'default',
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.guild?.preferredLocale ?? 'default',	
	
		fallback: (_: any) => 'en'
	}
}

export const resolveUser = (interaction: AllInteractions) => {
	return resolvers.user[getTypeOfInteraction(interaction) as keyof typeof resolvers.user]?.(interaction) || resolvers.user['fallback'](interaction)
}

export const resolveChannel = (interaction: AllInteractions) => {
	return resolvers.channel[getTypeOfInteraction(interaction) as keyof typeof resolvers.channel]?.(interaction) || resolvers.channel['fallback'](interaction)
}

export const resolveCommandName = (interaction: CommandInteraction | SimpleCommandMessage) => {
	return resolvers.commandName[interaction.constructor.name as keyof typeof resolvers.commandName]?.(interaction) || resolvers.commandName['fallback'](interaction)
}

export const resolveAction = (interaction: AllInteractions) => {
	return resolvers.action[getTypeOfInteraction(interaction) as keyof typeof resolvers.action]?.(interaction) || resolvers.action['fallback'](interaction)
}


export const resolveLocale = (interaction: AllInteractions) => {
	return resolvers.locale[getTypeOfInteraction(interaction) as keyof typeof resolvers.locale]?.(interaction) || resolvers.locale['fallback'](interaction)
}


export const getTypeOfInteraction = (interaction: any): string => {
	return interaction.constructor.name
}