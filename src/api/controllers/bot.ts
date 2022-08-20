import { Delete, Get, Middleware, Post, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"
import { Joi } from 'koa-context-validator'

import { BaseController } from "@utils/classes"
import { authenticated, botOnline, validator } from "@api/middlewares"
import { BaseGuildTextChannel, BaseGuildVoiceChannel, Channel, ChannelType, Guild as DGuild, GuildTextBasedChannel, NewsChannel, PermissionsBitField, User as DUser } from "discord.js"
import { generalConfig } from "@config"
import { getDevs, isDev, isInMaintenance, setMaintenance } from "@utils/functions"
import { Database } from "@services"
import { Guild, User } from '@entities'

@Router({ options: { prefix: '/bot' }})
@Middleware(
    botOnline,
    authenticated
)
@injectable()
export class BotController extends BaseController {

    constructor(
        private readonly client: Client,
        private readonly db: Database
    ) {
        super()
    }

    @Get('/info')
    async info(ctx: Context) {

        const user: any = this.client.user?.toJSON()
        if (user) {
            user.iconURL = this.client.user?.displayAvatarURL()
            user.bannerURL = this.client.user?.bannerURL()
        }

        const body = {
            user,
            owner: (await this.client.users.fetch(generalConfig.ownerId)).toJSON(),
        }

        this.ok(ctx, body)
    }


    @Get('/commands')
    async commands(ctx: Context) {

        const commands = this.client.applicationCommands

        this.ok(ctx, commands)
    }

    @Get('/guilds')
    async guilds(ctx: Context) {

        const body: any[] = []

        for (const discordRawGuild of this.client.guilds.cache.values()) {

            const discordGuild: any = discordRawGuild.toJSON()
            discordGuild.iconURL = discordRawGuild.iconURL()
            discordGuild.bannerURL = discordRawGuild.bannerURL()

            const databaseGuild = await this.db.getRepo(Guild).findOne({ id: discordGuild.id })

            body.push({
                discord: discordGuild,
                database: databaseGuild
            })
        }

        this.ok(ctx, body)
    }

    @Get('/guilds/:id')
    async guild(ctx: Context) {

        const { id } = <{ id: string }>ctx.params

        // get discord guild
        const discordRawGuild = await this.client.guilds.fetch(id)
        if (!discordRawGuild) {
            this.error(ctx, 'Guild not found', 404)
            return
        }
        const discordGuild: any = discordRawGuild.toJSON()
        discordGuild.iconURL = discordRawGuild.iconURL()
        discordGuild.bannerURL = discordRawGuild.bannerURL()

        // get database guild
        const databaseGuild = await this.db.getRepo(Guild).findOne({ id })

        const body = {
            discord: discordGuild,
            database: databaseGuild
        }

        this.ok(ctx, body)
    }

    @Delete('/guilds/:id')
    async deleteGuild(ctx: Context) {

        const { id } = <{ id: string }>ctx.params

        const guild = await this.client.guilds.fetch(id)
        if (!guild) {
            this.error(ctx, 'Guild not found', 404)
            return
        }

        await guild.leave()

        this.ok(ctx, { success: true })
    }

    @Get('/guilds/:id/invite')
    async invite(ctx: Context) {

        const { id } = <{ id: string }>ctx.params

        const guild = await this.client.guilds.fetch(id)
        if (!guild) {
            this.error(ctx, 'Guild not found', 404)
            return
        }

        const guildChannels = await guild.channels.fetch()
        for (const channel of guildChannels.values()) {
            if (
                (guild.members.me?.permissionsIn(channel).has(PermissionsBitField.Flags.CreateInstantInvite) || false) &&
                [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildNews].includes(channel.type)
            ) {
                const invite = await (channel as BaseGuildTextChannel | BaseGuildVoiceChannel | NewsChannel | undefined)?.createInvite()
                if(invite) { this.ok(ctx, invite); return }

                this.error(ctx, 'Could not create an invite', 500)
                return 
            }
        }

        this.error(ctx, 'Missing permission to create an invite in this guild', 401)
        return 
    }

    @Get('/users')
    async users(ctx: Context) {

        const users: any[] = [],
              guilds = this.client.guilds.cache.values()

        for (const guild of guilds) {

            const members = await guild.members.fetch()

            for (const member of members.values()) {
                if (!users.find(user => user.id === member.id)) {
                    
                    const discordUser: any = member.user.toJSON()
                    discordUser.iconURL = member.user.displayAvatarURL()
                    discordUser.bannerURL = member.user.bannerURL()

                    const databaseUser = await this.db.getRepo(User).findOne({ id: discordUser.id })

                    users.push({
                        discord: discordUser,
                        database: databaseUser
                    })
                }
            }
        }

        const body = users.map(user => user.toJSON())

        this.ok(ctx, body)
    }

    @Get('/users/:id')
    async user(ctx: Context) {

        const { id } = <{ id: string }>ctx.params
        
        // get discord user
        const discordRawUser = await this.client.users.fetch(id)
        if (!discordRawUser) {
            this.error(ctx, 'User not found', 404)
            return
        }
        const discordUser: any = discordRawUser.toJSON()
        discordUser.iconURL = discordRawUser.displayAvatarURL()
        discordUser.bannerURL = discordRawUser.bannerURL()
        
        // get database user
        const databaseUser = await this.db.getRepo(User).findOne({ id })

        const body = {
            discord: discordUser,
            database: databaseUser
        }

        this.ok(ctx, body)
    }

    @Get('/cachedUsers')
    async cachedUsers(ctx: Context) {

        const body = {
            users: this.client.users.cache.map(user => user.toJSON()),
        }

        this.ok(ctx, body)
    }

    @Get('/maintenance')
    async maintenance(ctx: Context) {

        const body = {
            maintenance: await isInMaintenance(),
        }

        this.ok(ctx, body)
    }

    @Post('/maintenance')
    @Middleware(
        validator({
            body: Joi.object().keys({
                maintenance: Joi.boolean().required()
            })
        })
    )
    async setMaintenance(ctx: Context) {

        const data = <{ maintenance: boolean }>ctx.request.body
        await setMaintenance(data.maintenance)

        const body = {
            maintenance: data.maintenance,
        }

        this.ok(ctx, body)
    }

    @Get('/devs')
    async devs(ctx: Context) {

        const body = getDevs()

        this.ok(ctx, body)
    }

    @Get('/devs/:id')
    async dev(ctx: Context) {

        const { id } = <{ id: string }>ctx.params

        const body = isDev(id)

        this.ok(ctx, body)
    }

    @Get('/test')
    async test(ctx: Context) {

        this.ok(ctx, { success: true })
    }
}