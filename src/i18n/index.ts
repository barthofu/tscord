export { L } from './i18n-node'
export { getLocaleFromInteraction } from './detectors'
export type { Locales, Translation } from "./i18n-types"
export { loadedLocales, locales } from "./i18n-util"



import { BaseTranslation } from 'typesafe-i18n'
import { Locales } from './i18n-types'
import en from "./en"
import fr from "./fr"

export const defaultTranslations: { [key in Locales]: BaseTranslation } = {
    en, fr
}