import { SimpleCommandMessage } from "discordx"
import {
    CommandInteraction,
	ButtonInteraction,
	ContextMenuInteraction,
    ModalSubmitInteraction,
	SelectMenuInteraction,
} from "discord.js"

type allInteractionTypes = CommandInteraction | SimpleCommandMessage | ButtonInteraction | ContextMenuInteraction | SelectMenuInteraction | ModalSubmitInteraction

export { allInteractionTypes }