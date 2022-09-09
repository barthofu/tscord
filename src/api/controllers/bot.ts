import { authenticated, botOnline } from "@api/middlewares"
import { generalConfig } from "@config"
import { Guild, User } from '@entities'
import { Database } from "@services"
import { BaseController } from "@utils/classes"
import { getDevs, isDev, isInMaintenance, setMaintenance } from "@utils/functions"
import { BaseGuildTextChannel, BaseGuildVoiceChannel, ChannelType, NewsChannel, PermissionsBitField } from "discord.js"
import { Client } from "discordx"
import type { Request, Response } from "express"
import { Context } from "koa"
import { Body, Controller, Get, Post, Delete, Param, UseBefore, JsonController, BodyParam } from "routing-controllers"
import { injectable } from "tsyringe"

@JsonController('/bot')
@UseBefore(
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
    async info() {

        const user: any = this.client.user?.toJSON()
        if (user) {
            user.iconURL = this.client.user?.displayAvatarURL()
            user.bannerURL = this.client.user?.bannerURL()
        }

        return {
            user,
            owner: (await this.client.users.fetch(generalConfig.ownerId)).toJSON(),
        }
    }


    @Get('/commands')
    async commands() {

        return this.client.applicationCommands
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

        return body
    }

    @Get('/guilds/:id')
    async guild(@Param('id') id: string, req: Request, res: Response) {

        // get discord guild
        const discordRawGuild = await this.client.guilds.fetch(id)
        if (!discordRawGuild) {
            this.error(res, 'Guild not found', 404)
            return
        }
        const discordGuild: any = discordRawGuild.toJSON()
        discordGuild.iconURL = discordRawGuild.iconURL()
        discordGuild.bannerURL = discordRawGuild.bannerURL()

        // get database guild
        const databaseGuild = await this.db.getRepo(Guild).findOne({ id })

        return {
            discord: discordGuild,
            database: databaseGuild
        }
    }

    @Delete('/guilds/:id')
    async deleteGuild(@Param('id') id: string, req: Request, res: Response) {

        const guild = await this.client.guilds.fetch(id)
        if (!guild) {
            this.error(res, 'Guild not found', 404)
            return
        }

        await guild.leave()

        return {
            success: true,
            message: 'Guild deleted'
        }
    }

    @Get('/guilds/:id/invite')
    async invite(@Param('id') id: string, req: Request, res: Response) {

        const guild = await this.client.guilds.fetch(id)
        if (!guild) {
            this.error(res, 'Guild not found', 404)
            return
        }

        const guildChannels = await guild.channels.fetch()
        for (const channel of guildChannels.values()) {
            if (
                (guild.members.me?.permissionsIn(channel).has(PermissionsBitField.Flags.CreateInstantInvite) || false) &&
                [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildNews].includes(channel.type)
            ) {
                const invite = await (channel as BaseGuildTextChannel | BaseGuildVoiceChannel | NewsChannel | undefined)?.createInvite()
                if(invite) return invite

                this.error(res, 'Could not create an invite', 500)
                return 
            }
        }

        this.error(res, 'Missing permission to create an invite in this guild', 401)
        return 
    }

    @Get('/users')
    async users() {

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

        return users.map(user => user.toJSON())
    }

    @Get('/users/:id')
    async user(@Param('id') id: string, req: Request, res: Response) {

        // get discord user
        const discordRawUser = await this.client.users.fetch(id)
        if (!discordRawUser) {
            this.error(res, 'User not found', 404)
            return
        }
        const discordUser: any = discordRawUser.toJSON()
        discordUser.iconURL = discordRawUser.displayAvatarURL()
        discordUser.bannerURL = discordRawUser.bannerURL()
        
        // get database user
        const databaseUser = await this.db.getRepo(User).findOne({ id })

        return {
            discord: discordUser,
            database: databaseUser
        }
    }

    @Get('/cachedUsers')
    async cachedUsers() {

        return this.client.users.cache.map(user => user.toJSON())
    }

    @Get('/maintenance')
    async maintenance() {

        return {
            maintenance: await isInMaintenance(),
        }
    }

    @Post('/maintenance')
    async setMaintenance(@BodyParam('maintenance', { required: true, type: Boolean }) maintenance: boolean) {

        await setMaintenance(maintenance)

        return {
            maintenance
        }
    }

    @Get('/devs')
    async devs() {

        return getDevs()
    }

    @Get('/devs/:id')
    async dev(@Param('id') id: string) {

        return isDev(id)
    }
}