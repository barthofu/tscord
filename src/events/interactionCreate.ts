import { Client, ArgsOf } from 'discordx'
import { injectable } from 'tsyringe'

import { Logger, Stats } from '@services'
import { Maintenance } from '@guards'
import { On, Guard, Discord } from '@decorators';
import { syncUser } from '@utils/functions';

@Discord()
@injectable()
export default class InteractionCreate {

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

        // insert user in db if not exists
        await syncUser(interaction.user)
        
        await this.stats.registerInteraction(interaction as AllInteractions)
        this.logger.logInteraction(interaction as AllInteractions)

        client.executeInteraction(interaction)
    }
}