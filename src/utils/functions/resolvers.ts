import { SimpleCommandMessage } from "discordx"
import {
    CommandInteraction,
	ChatInputCommandInteraction,
	ButtonInteraction,
	ContextMenuCommandInteraction,
    ModalSubmitInteraction,
	StringSelectMenuInteraction,
	Message,
	VoiceState,
	MessageReaction,
	PartialMessageReaction,
	Interaction,
} from "discord.js"

import packageJson from "../../../package.json"

const resolvers = {

	user: {
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.author,
		ChatInputCommandInteraction: (interaction: ChatInputCommandInteraction) => interaction.user,
		UserContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.member?.user,
		MessageContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.member?.user,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.member?.user,
		StringSelectMenuInteraction: (interaction: StringSelectMenuInteraction) => interaction.member?.user,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.member?.user,

		Message: (interaction: Message) => interaction.author,
		VoiceState: (interaction: VoiceState) => interaction.member?.user,
		MessageReaction: (interaction: MessageReaction) => interaction.message.author,
		PartialMessageReaction: (interaction: PartialMessageReaction) => interaction.message.author,

		fallback: (interaction: any) => null
	},

	member: {
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.member,
		ChatInputCommandInteraction: (interaction: ChatInputCommandInteraction) => interaction.member,
		UserContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.member,
		MessageContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.member,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.member,
		StringSelectMenuInteraction: (interaction: StringSelectMenuInteraction) => interaction.member,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.member,

		Message: (interaction: Message) => interaction.member,
		VoiceState: (interaction: VoiceState) => interaction.member,
		MessageReaction: (interaction: MessageReaction) => interaction.message.member,
		PartialMessageReaction: (interaction: PartialMessageReaction) => interaction.message.member,

		fallback: (interaction: any) => null
	},

	guild: {
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.guild,
		ChatInputCommandInteraction: (interaction: ChatInputCommandInteraction) => interaction.guild,
		UserContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.guild,
		MessageContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.guild,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.guild,
		StringSelectMenuInteraction: (interaction: StringSelectMenuInteraction) => interaction.guild,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.guild,

		fallback: (interaction: any) => null
	},

	channel: {
		ChatInputCommandInteraction: (interaction: ChatInputCommandInteraction) => interaction.channel,
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.channel,
		UserContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.channel,
		MessageContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.channel,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.channel,
		StringSelectMenuInteraction: (interaction: StringSelectMenuInteraction) => interaction.channel,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.channel,

		fallback: (interaction: any) => null
	},

	commandName: {
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.name,
		ChatInputCommandInteraction: (interaction: ChatInputCommandInteraction) => interaction.commandName,
		UserContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.commandName,
		MessageContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.commandName,

		fallback: (_: any) => ''
	},

	action: {
		ChatInputCommandInteraction: (interaction: ChatInputCommandInteraction) => {
			return interaction.commandName 
				+ (interaction?.options.getSubcommandGroup(false) ? ' ' + interaction.options.getSubcommandGroup(false) : '')
				+ (interaction?.options.getSubcommand(false) ? ' ' + interaction.options.getSubcommand(false) : '')
		},
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.name,
		UserContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.commandName,
		MessageContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.commandName,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.customId,
		StringSelectMenuInteraction: (interaction: StringSelectMenuInteraction) => interaction.customId,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.customId,	
	
		fallback: (_: any) => ''
	},

	locale: {
		SimpleCommandMessage: (interaction: SimpleCommandMessage) => interaction.message.guild?.preferredLocale ?? 'default',
		ChatInputCommandInteraction: (interaction: ChatInputCommandInteraction) => interaction.locale,
		UserContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.locale,
		MessageContextMenuCommandInteraction: (interaction: ContextMenuCommandInteraction) => interaction.locale,
		
		ButtonInteraction: (interaction: ButtonInteraction) => interaction.locale,
		StringSelectMenuInteraction: (interaction: StringSelectMenuInteraction) => interaction.locale,
        ModalSubmitInteraction: (interaction: ModalSubmitInteraction) => interaction.locale,	
	
		fallback: (_: any) => 'en'
	}
}

export const resolveUser = (interaction: AllInteractions | Interaction | Message | VoiceState | MessageReaction | PartialMessageReaction) => {
	return resolvers.user[getTypeOfInteraction(interaction) as keyof typeof resolvers.user]?.(interaction) || resolvers.user['fallback'](interaction)
}

export const resolveMember = (interaction: AllInteractions | Interaction | Message | VoiceState | MessageReaction | PartialMessageReaction) => {
	return resolvers.member[getTypeOfInteraction(interaction) as keyof typeof resolvers.member]?.(interaction) || resolvers.member['fallback'](interaction)
}

export const resolveGuild = (interaction: AllInteractions | Interaction | Message | VoiceState | MessageReaction | PartialMessageReaction) => {
	return resolvers.guild[getTypeOfInteraction(interaction) as keyof typeof resolvers.guild]?.(interaction) || resolvers.guild['fallback'](interaction)
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

export const getTscordVersion = () => {

	return packageJson.tscord.version
}