import { ArgsOf, Client, Guard, SimpleCommandMessage } from 'discordx'

import { Discord, Injectable, On, OnCustom } from '@/decorators'
import { Guild, User } from '@/entities'
import { Maintenance } from '@/guards'
import { Database, EventManager, Logger, Stats } from '@/services'
import { getPrefixFromMessage, syncUser } from '@/utils/functions'

@Discord()
@Injectable()
export default class SimpleCommandCreateEvent {

	constructor(
		private stats: Stats,
		private logger: Logger,
		private db: Database,
		private eventManager: EventManager
	) {}

	// =============================
	// ========= Handler ===========
	// =============================

	@OnCustom('simpleCommandCreate')
	async simpleCommandCreateHandler(command: SimpleCommandMessage) {
		// insert user in db if not exists
		await syncUser(command.message.author)

		// update last interaction time of both user and guild
		await this.db.get(User).updateLastInteract(command.message.author.id)
		await this.db.get(Guild).updateLastInteract(command.message.guild?.id)

		await this.stats.registerSimpleCommand(command)
		this.logger.logInteraction(command)
	}

	// =============================
	// ========== Emitter ==========
	// =============================

	@On('messageCreate')
	@Guard(
		Maintenance
	)
	async simpleCommandCreateEmitter(
		[message]: ArgsOf<'messageCreate'>,
		client: Client
	) {
		const prefix = await getPrefixFromMessage(message)
		const command = await client.parseCommand(prefix, message, false)

		if (command && command instanceof SimpleCommandMessage) {
			/**
			 * @param {SimpleCommandMessage} command
			 */
			this.eventManager.emit('simpleCommandCreate', command)
		}
	}

}
