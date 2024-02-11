import { noCase, snakeCase } from 'change-case'
import { SlashOption as SlashOptionX, SlashOptionOptions as SlashOptionOptionsX, VerifyName } from 'discordx'

import { InvalidOptionName } from '@/errors'
import { constantPreserveDots, sanitizeLocales, setFallbackDescription, setOptionsLocalization } from '@/utils/functions'

/**
 * Add a slash command option
 *
 * @param options - Slash option options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/decorators/commands/slash-option)
 *
 * @category Decorator
 */
export function SlashOption(options: SlashOptionOptions) {
	let localizationSource: TranslationsNestedPaths | null = null

	if (options.localizationSource)
		localizationSource = constantPreserveDots(options.localizationSource) as TranslationsNestedPaths

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

	if (!isValidOptionName(options.name))
		throw new InvalidOptionName(options.name)
	if (options.nameLocalizations) {
		for (const name of Object.values(options.nameLocalizations)) {
			if (!isValidOptionName(name))
				throw new InvalidOptionName(name)
		}
	}

	if (!options.description)
		options = setFallbackDescription(options)

	return SlashOptionX(options as SlashOptionOptionsX<VerifyName<string>, string>)
}

function isValidOptionName(name: string) {
	return (noCase(name) === name || snakeCase(name) === name) && !name.includes(' ')
}
