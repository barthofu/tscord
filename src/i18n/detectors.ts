import { AllInteractions } from '@types'
import { resolveLocale } from '@utils/functions'

import config from '../../config.json'
import { detectLocale } from './i18n-util'

const allInteractionsLocaleDetector = (interaction: AllInteractions) => {

    return () => {

        let locale = resolveLocale(interaction)
        
        if (['en-US', 'en-GB'].includes(locale)) locale = 'en'
        else if (locale === 'default') locale = config.defaultLocale

        return [locale]
    }
}

export const getLocaleFromInteraction = (interaction: AllInteractions) => detectLocale(allInteractionsLocaleDetector(interaction))