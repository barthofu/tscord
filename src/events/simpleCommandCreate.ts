import { ArgsOf, Client, SimpleCommandMessage } from 'discordx'
import { injectable } from 'tsyringe'

import { On, Discord } from '@decorators'
import { Stats, Logger, Database } from '@services'
import { Guild, User } from '@entities'

@Discord()
@injectable()
export default class SimpleCommandCreate {

    constructor(
        private stats: Stats,
        private logger: Logger,
        private db: Database
    ) {}

    @On('simpleCommandCreate')
    async simpleCommandCreate([command]: [SimpleCommandMessage]) {

        // update last interaction time of both user and guild
        await this.db.getRepo(User).updateLastInteract(command.message.author.id)
        await this.db.getRepo(Guild).updateLastInteract(command.message.guild?.id)

        await this.stats.registerSimpleCommand(command)
        this.logger.logSimpleCommand(command)
    }
}