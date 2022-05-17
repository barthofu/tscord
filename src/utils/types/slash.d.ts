import type { ApplicationCommandOptions } from 'discordx'

type SlashCommandOption = ApplicationCommandOptions & {
    nsfw?: boolean
    cooldown?: number
}