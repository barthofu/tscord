import { SimpleCommandMessage } from "discordx"
import {
    CommandInteraction,
	ButtonInteraction,
	ContextMenuInteraction,
    ModalSubmitInteraction,
	SelectMenuInteraction,
} from "discord.js"

type interactionsStarters = CommandInteraction | SimpleCommandMessage | ContextMenuInteraction
type inlineInteractions = ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction

type AllInteractions = interactionsStarters | inlineInteractions

export { interactionsStarters, inlineInteractions, AllInteractions }