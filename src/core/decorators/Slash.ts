import { SlashCommandOption } from '@/types/slash'
import { Slash as SlashX } from 'discordx'

export function Slash(name: string, options?: SlashCommandOption) {
        
    
    return SlashX(name, options)
}