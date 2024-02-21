import { FormattersInitializer } from 'typesafe-i18n'

import { Formatters, Locales } from './i18n-types'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (_locale: Locales) => {
	const formatters: Formatters = {
		// add your formatter functions here
	}

	return formatters
}
