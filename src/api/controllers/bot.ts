import { authenticated, botOnline } from "@api/middlewares"
import { generalConfig } from "@config"
import { Guild, User } from '@entities'
import { Database } from "@services"
import { BaseController } from "@utils/classes"
import { getDevs, isDev, isInMaintenance, setMaintenance } from "@utils/functions"
import { BaseGuildTextChannel, BaseGuildVoiceChannel, ChannelType, NewsChannel, PermissionsBitField, Guild as DGuild } from "discord.js"
import { Client, MetadataStorage } from "discordx"
import type { Request, Response } from "express"
import { BodyParam, Delete, Get, JsonController, NotFoundError, Param, Post, UnauthorizedError, UseBefore } from "routing-controllers"
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

        const commands = MetadataStorage.instance.applicationCommands

        return commands.map(command => command.toJSON())
    }

    @Get('/guilds')
    async guilds() {

        const body: any[] = []

        for (const discordRawGuild of this.client.guilds.cache.values()) {

            const discordGuild: any = discordRawGuild.toJSON()
            discordGuild.iconURL = discordRawGuild.iconURL()
            discordGuild.bannerURL = discordRawGuild.bannerURL()

            const databaseGuild = await this.db.get(Guild).findOne({ id: discordGuild.id })

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
        try {

            const discordRawGuild = await this.client.guilds.fetch(id)

            const discordGuild: any = discordRawGuild.toJSON()
            discordGuild.iconURL = discordRawGuild.iconURL()
            discordGuild.bannerURL = discordRawGuild.bannerURL()

            // get database guild
            const databaseGuild = await this.db.get(Guild).findOne({ id })

            return {
                discord: discordGuild,
                database: databaseGuild
            }

        } catch (err) {

            throw new NotFoundError('Guild not found')
        }
    }

    @Delete('/guilds/:id')
    async deleteGuild(@Param('id') id: string, req: Request, res: Response) {

        try {

            const guild = await this.client.guilds.fetch(id)
    
            await guild.leave()
    
            return {
                success: true,
                message: 'Guild deleted'
            }

        } catch (err) {

            throw new NotFoundError('Guild not found')
        }
    }

    @Get('/guilds/:id/invite')
    async invite(@Param('id') id: string, req: Request, res: Response) {

        let guild: DGuild | undefined
        try {
            guild = await this.client.guilds.fetch(id)
        } catch (err) {
            throw new NotFoundError('Guild not found')
        }

        if (guild) {

            const guildChannels = await guild.channels.fetch()
    
            let invite: any
            for (const channel of guildChannels.values()) {
    
                if (
                    (guild.members.me?.permissionsIn(channel).has(PermissionsBitField.Flags.CreateInstantInvite) || false) &&
                    [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildNews].includes(channel.type)
                ) {
                    invite = await (channel as BaseGuildTextChannel | BaseGuildVoiceChannel | NewsChannel | undefined)?.createInvite()
                    if (invite) break
                }
            }
    
            if (invite) return invite.toJSON()
            else {
                throw new UnauthorizedError('Missing permission to create an invite in this guild')           
            }
        }
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

                    const databaseUser = await this.db.get(User).findOne({ id: discordUser.id })

                    users.push({
                        discord: discordUser,
                        database: databaseUser
                    })
                }
            }
        }

        return users
    }

    @Get('/users/:id')
    async user(@Param('id') id: string, req: Request, res: Response) {

        // get discord user
        try {

            const discordRawUser = await this.client.users.fetch(id)

            const discordUser: any = discordRawUser.toJSON()
            discordUser.iconURL = discordRawUser.displayAvatarURL()
            discordUser.bannerURL = discordRawUser.bannerURL()
            
            // get database user
            const databaseUser = await this.db.get(User).findOne({ id })
    
            return {
                discord: discordUser,
                database: databaseUser
            }

        } catch (err) {

            throw new NotFoundError('User not found')
        }
    }

    @Get('/users/cached')
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