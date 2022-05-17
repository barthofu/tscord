import { Slash as SlashX } from 'discordx'
import { StateStore } from '@core/stores'

import type { SlashCommandOption } from '@types'

export function Slash(name: string, options?: SlashCommandOption) {

    // register the command in the store
    StateStore.commands.push({
        name,
        nsfw: options?.nsfw || false,
        cooldown: options?.cooldown || 0
    })

    return SlashX(name, options)
}