import { ArgsOf, Client } from 'discordx'

import { On, Discord } from '@decorators'
import { syncGuild } from '@utils/functions'

@Discord()
export default class GuildCreate {

    @On('guildCreate')
    async handler(
        [newGuild]: ArgsOf<'guildCreate'>,
        client: Client
    ) {

        await syncGuild(newGuild.id, client)
    }
}