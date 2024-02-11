import fs from 'node:fs'
import process from 'node:process'

import { env } from '@/env'

/**
 * recursively get files paths from a directory
 * @param path
 */
export function getFiles(path: string): string[] {
	if (!fs.existsSync(path))
		return []

	const files = fs.readdirSync(path)
	const fileList = []

	for (const file of files) {
		const filePath = `${path}/${file}`
		const stats = fs.statSync(filePath)

		if (stats.isDirectory())
			fileList.push(...getFiles(filePath))
		else
			fileList.push(filePath)
	}

	return fileList
}

export function fileOrDirectoryExists(path: string): boolean {
	return fs.existsSync(path)
}

export function getSourceCodeLocation(): string {
	return `${process.cwd()}/${env.NODE_ENV === 'production' ? 'build' : 'src'}`
}
