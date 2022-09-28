declare enum AdditionalLocaleString {
    English = 'en'
}

type TranslationsNestedPaths = NestedPaths<import('@i18n').Translation>

type LocalizationMap = Partial<Record<`${import('discord-api-types/v9').Locale | AdditionalLocaleString}`, string>>

type SanitizedOptions = {
    descriptionLocalizations?: LocalizationMap
    nameLocalizations?: LocalizationMap
    localizationSource?: TranslationsNestedPaths
}

type ApplicationCommandOptions = Modify<import('discordx').ApplicationCommandOptions, SanitizedOptions>
type SlashChoiceOption = Modify<import('discordx').SlashChoiceType<string, string | number>, SanitizedOptions>
type SlashOptionOptions = Modify<import('discordx').SlashOptionOptions, SanitizedOptions>
type SlashGroupOptions = Modify<import('discordx').SlashGroupOptions, SanitizedOptions>

type ContextMenuOptionsX = Omit<import('discordx').ApplicationCommandOptions<import('discordx').NotEmpty<string>> & {
    type: Exclude<import('discord.js').ApplicationCommandType, import('discord.js').ApplicationCommandType.ChatInput>
}, "description" | "descriptionLocalizations">

type ContextMenuOptions = Modify<Modify<ContextMenuOptionsX, SanitizedOptions>, {
    type: ContextMenuOptionsX['type'] | 'USER' | 'MESSAGE'
}>