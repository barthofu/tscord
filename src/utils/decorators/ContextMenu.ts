import { ApplicationCommandType } from 'discord.js'
import { ContextMenu as ContextMenuX } from 'discordx'

import { constantPreserveDots, getCallerFile, sanitizeLocales, setOptionsLocalization } from '@/utils/functions'

/**
 * Interact with context menu with a defined identifier
 *
 * @param options - Application command options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/decorators/gui/context-menu)
 *
 * @category Decorator
 */
export function ContextMenu(options: ContextMenuOptions) {
	let localizationSource: TranslationsNestedPaths | null = null
	const commandNameFromFile = getCallerFile(1)?.split('/').pop()?.split('.')[0]

	if (options.localizationSource)
		localizationSource = constantPreserveDots(options.localizationSource) as TranslationsNestedPaths
	else if (options.name)
		localizationSource = `COMMANDS.${constantPreserveDots(options.name)}` as TranslationsNestedPaths
	else if (commandNameFromFile)
		localizationSource = `COMMANDS.${constantPreserveDots(commandNameFromFile)}` as TranslationsNestedPaths

	if (localizationSource) {
		options = setOptionsLocalization({
			target: 'name',
			options,
			localizationSource,
			nameFallback: commandNameFromFile,
		})
	}

	options = sanitizeLocales(options)

	// interop type string if any into enum types
	if (options.type === 'USER')
		options.type = ApplicationCommandType.User
	else if (options.type === 'MESSAGE')
		options.type = ApplicationCommandType.Message

	return ContextMenuX(options as ContextMenuOptionsX)
}
