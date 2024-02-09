import { ColorResolvable } from 'discord.js'

import { colorsConfig } from '@/configs'

/**
 * Get a color from the config
 * @param colorResolver the color to resolve
 * @returns the resolved color
 */
export function getColor(colorResolver: keyof typeof colorsConfig) {
	return colorsConfig[colorResolver] as ColorResolvable
}
