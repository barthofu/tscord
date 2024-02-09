import { ArgsOf, Client } from 'discordx'

import { Discord, Guard, On } from '@/decorators'
import { Maintenance } from '@/guards'

@Discord()
export default class MessageCreateEvent {

	@On('messageCreate')
	@Guard(
		Maintenance
	)
	async messageCreateHandler(
		[message]: ArgsOf<'messageCreate'>,
		client: Client
	) {
		await client.executeCommand(message, false)
	}

}
