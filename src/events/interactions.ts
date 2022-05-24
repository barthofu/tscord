import { Client, Discord, On, ArgsOf } from 'discordx'
import { injectable } from 'tsyringe'
import { Stats } from '@helpers'

@Discord()
@injectable()
export default class {

    constructor(
        private stats: Stats
    ) {}

    @On('interactionCreate')
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>, 
        client: Client
    ) {

        await this.stats.registerInteraction([interaction])

        client.executeInteraction(interaction)
    }
}