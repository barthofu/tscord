import { Slash as SlashX } from 'discordx'
import type { SlashCommandOption } from '@types'

import { registerCommand } from '@utils/functions'

export function Slash(name: string, options?: SlashCommandOption) {
    
    registerCommand(name, { 
        nsfw: options?.nsfw || false,
        cooldown: options?.cooldown || 0
    })

    return SlashX(name, options)
}