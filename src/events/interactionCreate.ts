import { CommandInteraction} from 'discord.js'
import { Client, ArgsOf } from 'discordx'
import { injectable } from 'tsyringe'

import { Database, Logger, Stats } from '@services'
import { Maintenance } from '@guards'
import { Guild, User } from '@entities'
import { On, Guard, Discord } from '@decorators'
import { syncUser } from '@utils/functions'

@Discord()
@injectable()
export default class InteractionCreateEvent {

    constructor(
        private stats: Stats,
        private logger: Logger,
        private db: Database
    ) {}

    @On('interactionCreate')
    @Guard(
        Maintenance
    )
    async interactionCreateHandler(
        [interaction]: ArgsOf<'interactionCreate'>, 
        client: Client
    ) {
        
        // defer the reply
        if (interaction instanceof CommandInteraction) await interaction.deferReply()

        // insert user in db if not exists
        await syncUser(interaction.user)
        
        // update last interaction time of both user and guild
        await this.db.get(User).updateLastInteract(interaction.user.id)
        await this.db.get(Guild).updateLastInteract(interaction.guild?.id)

        // register logs and stats
        await this.stats.registerInteraction(interaction as AllInteractions)
        this.logger.logInteraction(interaction as AllInteractions)

        client.executeInteraction(interaction)
    }
}