declare enum AdditionnalLocaleString {
    English = 'en'
}

type LocalizationMap = Partial<Record<`${import('discord-api-types/v9').Locale | AdditionnalLocaleString}`, string>>

type SanitizedOptions = {
    descriptionLocalizations?: LocalizationMap
    nameLocalizations?: LocalizationMap
    localizationSource?: keyof import('@i18n').Translation['COMMANDS']
}

type ApplicationCommandOptions = Modify<import('discordx').ApplicationCommandOptions, SanitizedOptions>
type SlashChoiceOption = Modify<import('discordx').SlashChoiceType<string, string | number>, SanitizedOptions>
type SlashOptionOptions = Modify<import('discordx').SlashOptionOptions, SanitizedOptions>