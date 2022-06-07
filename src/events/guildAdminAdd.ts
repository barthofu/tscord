import { Client, Discord, ArgsOf, Guard } from 'discordx'
import { injectable } from 'tsyringe'
import { Logger, Stats } from '@helpers'
import { Maintenance } from '@guards'
import { On } from '@decorators';
import { Collection, GuildMember, Role } from 'discord.js';

@Discord()
@injectable()
export default class InteractionCreate {

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
        console.log(client);
        this.logger.log(`${newMember.nickname} has been added as an admin`);
    }
}