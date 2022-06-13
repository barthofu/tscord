import { Locale } from 'discord-api-types/v9';
import { IGuild, Slash as SlashX, VerifyName } from 'discordx'

enum AdditionnalLocaleString {
    English = 'en'
}

type LocalizationMap = Partial<Record<`${Locale | AdditionnalLocaleString}`, string>>

type ApplicationCommandOptions = {
    botIds?: string[];
    defaultPermission?: boolean;
    description?: string;
    descriptionLocalizations?: LocalizationMap;
    guilds?: IGuild[];
    nameLocalizations?: LocalizationMap;
}

/**
 * Handle a slash command with a defined nam
 * @param name - slash name
 * @param options - slash options
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/commands/slash)
 *
 * @category Decorator
 */
export const Slash = <T extends string>(name?: VerifyName<T>, options?: ApplicationCommandOptions) => {

    // convert 'en' localizations to 'en-US' and 'en-GB'
    if (options?.nameLocalizations?.['en']) {
        options.nameLocalizations['en-US'] = options.nameLocalizations['en']
        options.nameLocalizations['en-GB'] = options.nameLocalizations['en']
        delete options.nameLocalizations['en']
    }
    else if (options?.descriptionLocalizations?.['en']) {
        options.descriptionLocalizations['en-US'] = options.descriptionLocalizations['en']
        options.descriptionLocalizations['en-GB'] = options.descriptionLocalizations['en']
        delete options.descriptionLocalizations['en']
    }
    
    return SlashX(name, options)
}