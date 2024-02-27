// Using inline import makes possible for a type to be casted to the ambient module declaration, so we don't need to import it in other files.
// https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts

type EmittedInteractions = import('discord.js').CommandInteraction | import('discordx').SimpleCommandMessage | import('discord.js').ContextMenuCommandInteraction
type OnTheFlyInteractions = import('discord.js').ButtonInteraction | import('discord.js').StringSelectMenuInteraction | import('discord.js').ModalSubmitInteraction

type AllInteractions = EmittedInteractions | OnTheFlyInteractions

type InteractionsConstants = 'CHAT_INPUT_COMMAND_INTERACTION' | 'SIMPLE_COMMAND_MESSAGE' | 'CONTEXT_MENU_INTERACTION' | 'BUTTON_INTERACTION' | 'SELECT_MENU_INTERACTION' | 'MODAL_SUBMIT_INTERACTION'

type CommandCategory = import('discordx').DApplicationCommand & import('@discordx/utilities').ICategory

type InteractionData = {
	sanitizedLocale: import('src/i18n').Locales
	localize: import('src/i18n/i18n-types').TranslationFunctions
}
