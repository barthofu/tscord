import { Client, Discord, On, ArgsOf } from 'discordx'
import { injectable } from 'tsyringe'
import { Logger, Stats } from '@helpers'

@Discord()
@injectable()
export default class {

    constructor(
        private stats: Stats,
        private logger: Logger
    ) {}

    @On('interactionCreate')
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>, 
        client: Client
    ) {

        await this.stats.registerInteraction(interaction)
        this.logger.logInteraction(interaction)

        client.executeInteraction(interaction)
    }
}