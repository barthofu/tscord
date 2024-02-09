import { ArgsOf, Client } from 'discordx'

import { Discord, On } from '@/decorators'
import { syncGuild } from '@/utils/functions'

@Discord()
export default class GuildCreateEvent {

	@On('guildCreate')
	async guildCreateHandler(
		[newGuild]: ArgsOf<'guildCreate'>,
		client: Client
	) {
		await syncGuild(newGuild.id, client)
	}

}
