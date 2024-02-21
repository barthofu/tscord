import { generalConfig } from '@/configs'

/**
 * Get a curated list of devs including the owner id
 */
export function getDevs(): string[] {
	return [...new Set([...generalConfig.devs, generalConfig.ownerId])]
}

/**
 * Check if a given user is a dev with its ID
 * @param id Discord user id
 */
export function isDev(id: string): boolean {
	return getDevs().includes(id)
}
