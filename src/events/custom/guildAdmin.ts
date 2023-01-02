import { Collection, GuildMember, PermissionFlagsBits, Role } from "discord.js"
import { ArgsOf, Client } from "discordx"
import { injectable } from "tsyringe"

import { Discord, Guard, On, OnCustom } from "@decorators"
import { Maintenance } from "@guards"
import { EventManager, Logger } from "@services"

@Discord()
@injectable()
export default class GuildAdminAddEvent {

    constructor(
        private logger: Logger,
        private eventManager: EventManager
    ) {}

    // =============================
    // ========= Handlers ==========
    // =============================

    @On('guildAdminAdd')
    @Guard(
        Maintenance
    )
    async guildAdminAddHandler(
        member: GuildMember,
        newAdminRoles: Collection<String, Role>,
        client: Client
    ) {
        
        this.logger.log(`${member.nickname} has been added as an admin`)
    }

    @OnCustom('guildAdminDelete')
    @Guard(
        Maintenance
    )
    async guildAdminDeleteHandler(
        member: GuildMember,
        oldAdminRoles: Collection<String, Role>,
        client: Client
    ) {
        
        this.logger.log(`${member.nickname} has been removed from admins`)
    }

    // =============================
    // ========== Emitter ==========
    // =============================

    @On('guildMemberUpdate')
    async guildAdminEmitter(
        [oldMember, newMember]: ArgsOf<'guildMemberUpdate'>, 
        client: Client
    ) {

        if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            
            const newAdminRoles: Collection<String, Role> = 
                newMember.roles.cache.filter(role => 
                    !oldMember.roles.cache.has(role.id) 
                    && role.permissions.has(PermissionFlagsBits.Administrator)
                )
            if (newAdminRoles.size === 0) return

            /**
             * @param {GuildMember} member
             * @param {Collection<String, Role>} newAdminRoles 
             */
            this.eventManager.emit('guildAdminAdd', newMember, newAdminRoles)
        }
        else if (oldMember.roles.cache.size > newMember.roles.cache.size) {

            const oldAdminRoles: Collection<String, Role> = 
                oldMember.roles.cache.filter(role => 
                    !newMember.roles.cache.has(role.id) 
                    && role.permissions.has(PermissionFlagsBits.Administrator)
                )
            if (oldAdminRoles.size === 0) return

            /**
             * @param {GuildMember} member
             * @param {Collection<String, Role>} oldAdminRoles
             */
            this.eventManager.emit('guildAdminRemove', newMember, oldAdminRoles)            
        }
    }
}