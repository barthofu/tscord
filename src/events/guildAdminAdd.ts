import { Collection, GuildMember, Role } from 'discord.js';
import { Client, ArgsOf } from 'discordx'
import { injectable } from 'tsyringe'

import { Logger, Stats } from '@services'
import { Maintenance } from '@guards'
import { On, Discord, Guard } from '@decorators';

@Discord()
@injectable()
export default class GuildAdminAdd {

    constructor(
        private stats: Stats,
        private logger: Logger
    ) {}

    @On('guildAdminAdd')
    @Guard(
        Maintenance
    )
    async interactionCreate(
        newMember: GuildMember,
        newAdminRoles: Collection<String, Role>,
        client: Client
    ) {
        
        this.logger.log('info', `${newMember.nickname} has been added as an admin`)
    }
}