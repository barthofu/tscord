// Using inline import makes possible for a type to be casted to the ambient module declaration, so we don't need to import it in other files.
// https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts

type EmittedInteractions = import('discord.js').CommandInteraction | import('discordx').SimpleCommandMessage | import('discord.js').ContextMenuInteraction
type OnTheFlyInteractions = import('discord.js').ButtonInteraction | import('discord.js').SelectMenuInteraction | import('discord.js').ModalSubmitInteraction

type AllInteractions = EmittedInteractions | OnTheFlyInteractions