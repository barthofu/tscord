import { Client, ArgsOf } from 'discordx'
import { Collection, Role } from 'discord.js'
import { injectable } from 'tsyringe'

import { Logger, Stats } from '@helpers'
import { On, Discord } from '@decorators'

@Discord()
@injectable()
export default class {

    constructor(
        private stats: Stats,
        private logger: Logger
    ) {}

    @On('guildMemberUpdate')
    async guildMemberUpdate(
        [oldMember, newMember]: ArgsOf<'guildMemberUpdate'>, 
        client: Client
    ) {
        if(oldMember.roles.cache.size < newMember.roles.cache.size) {
            const newAdminRoles : Collection<String, Role> = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id) && role.permissions.has('ADMINISTRATOR'));
            if(newAdminRoles.size === 0) return;

            /**
             * @param newMember GuildMember
             * @param newAdminRoles Collection<String, Role>
             */
            client.emit('guildAdminAdd', newMember, newAdminRoles);
        } else if(oldMember.roles.cache.size > newMember.roles.cache.size) {
            // TODO
        }
    }
}