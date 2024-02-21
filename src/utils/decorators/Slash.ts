import { ApplicationCommandOptions as ApplicationCommandOptionsX, Slash as SlashX, VerifyName } from 'discordx'

import { constantPreserveDots, sanitizeLocales, setFallbackDescription, setOptionsLocalization } from '@/utils/functions'

/**
 * Handle a slash command
 * @param options - slash options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 *
 * @category Decorator
 */
export function Slash(options?: ApplicationCommandOptions | string) {
	if (!options)
		options = { }
	else if (typeof options === 'string')
		options = { name: options }

	let localizationSource: TranslationsNestedPaths | null = null

	if (options.localizationSource)
		localizationSource = constantPreserveDots(options.localizationSource) as TranslationsNestedPaths
	else if (options.name)
		localizationSource = `COMMANDS.${constantPreserveDots(options.name)}` as TranslationsNestedPaths

	if (localizationSource) {
		options = setOptionsLocalization({
			target: 'description',
			options,
			localizationSource,
		})

		options = setOptionsLocalization({
			target: 'name',
			options,
			localizationSource,
		})
	}

	options = sanitizeLocales(options)

	if (!options.description)
		options = setFallbackDescription(options)

	return SlashX(options as ApplicationCommandOptionsX<VerifyName<string>, string>)
}
