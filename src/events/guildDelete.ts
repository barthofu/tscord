import { ArgsOf, Client } from 'discordx'

import { On, Discord } from '@decorators'
import { syncGuild } from '@utils/functions'

@Discord()
export default class GuildDelete {

    @On('guildDelete')
    async handler(
        [oldGuild]: ArgsOf<'guildDelete'>,
        client: Client
    ) {

       await syncGuild(oldGuild.id, client)
    }
}