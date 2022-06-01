import { Client, Discord, On, ArgsOf, Guard } from 'discordx'
import { injectable } from 'tsyringe'
import { Logger, Stats } from '@helpers'
import { Maintenance } from '@guards'

@Discord()
@injectable()
export default class {

    constructor(
        private stats: Stats,
        private logger: Logger
    ) {}

    @On('interactionCreate')
    @Guard(
        Maintenance
    )
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>, 
        client: Client
    ) {

        await this.stats.registerInteraction(interaction)
        this.logger.logInteraction(interaction)

        client.executeInteraction(interaction)
    }
}