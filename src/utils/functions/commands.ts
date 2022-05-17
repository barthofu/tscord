import { StateStore } from "@core/stores"
import { CommandInteraction } from "discord.js"
import { SimpleCommandMessage } from "discordx"
import { getNameOfInteraction } from "./interaction"

export const getCommandInStoreFromInteraction = (interaction: CommandInteraction | SimpleCommandMessage) => {
    const name = getNameOfInteraction(interaction)
    return StateStore.commands.find(command => command.name.toLowerCase() === name?.toLowerCase()) ?? null
}