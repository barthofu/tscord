import { ArgsOf, Client, SimpleCommandMessage } from 'discordx'
import { injectable } from 'tsyringe'

import { On, Discord } from '@decorators'
import { Stats, Logger } from '@services'

@Discord()
@injectable()
export default class SimpleCommandCreate {

    constructor(
        private stats: Stats,
        private logger: Logger,
    ) {}

    @On('simpleCommandCreate')
    async simpleCommandCreate([command]: [SimpleCommandMessage]) {

        await this.stats.registerSimpleCommand(command)
        this.logger.logSimpleCommand(command)
    }
}