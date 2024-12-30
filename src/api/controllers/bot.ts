import { BodyParams, Controller, Delete, Get, PathParams, Post, UseBefore } from '@tsed/common'
import { Exception, NotFound, Unauthorized } from '@tsed/exceptions'
import { Required } from '@tsed/schema'
import { BaseGuildTextChannel, BaseGuildVoiceChannel, ChannelType, Client, NewsChannel, PermissionsBitField, ShardingManager } from 'discord.js'

import { BotOnline, DevAuthenticated } from '@/api/middlewares'
import { generalConfig } from '@/configs'
import { Guild, User } from '@/entities'
import { Database } from '@/services'
import { BaseController } from '@/utils/classes'
import { getDevs, isDev, isInMaintenance, resolveDependencies, setMaintenance } from '@/utils/functions'

@Controller('/bot')
@UseBefore(
	BotOnline,
	DevAuthenticated
)
export class BotController extends BaseController {

	private manager: ShardingManager

	// test
	private db: Database

	constructor() {
		super()

		resolveDependencies([ShardingManager, Database]).then(([manager, db]) => {
			this.manager = manager
			this.db = db
		})
	}

	@Get('/info')
	async info() {
		return await this.manager.broadcastEval(async (client: Client) => {
			const user: any = client.user?.toJSON()
			if (user) {
				user.iconURL = client.user?.displayAvatarURL()
				user.bannerURL = client.user?.bannerURL()
			}

			return {
				user,
				owner: (await client.users.fetch(generalConfig.ownerId).catch(() => null))?.toJSON(),
			}
		}, { shard: 0 })
	}

	@Get('/commands')
	async commands() {
		return await this.manager.broadcastEval(async (_) => {
			const discordx = await import('discordx')
			const commands = discordx.MetadataStorage.instance.applicationCommands

			return commands?.map(command => command.toJSON())
		}, { shard: 0 })
	}

	@Get('/guilds')
	async guilds() {
		const guilds = (await this.manager.broadcastEval(async (client: Client) => {
			const guilds: any[] = []

			for (const discordRawGuild of client.guilds.cache.values()) {
				const discordGuild: any = discordRawGuild.toJSON()
				discordGuild.iconURL = discordRawGuild.iconURL()
				discordGuild.bannerURL = discordRawGuild.bannerURL()

				guilds.push({
					discord: discordGuild,
					database: null,
				})
			}

			return guilds
		})).flat()

		for (let i = 0; i < guilds.length; i++) {
			guilds[i].database = await this.db.get(Guild).findOne({ id: guilds[i].discord.id })
		}

		return guilds
	}

	@Get('/guilds/:id')
	async guild(@PathParams('id') id: string) {
		const guilds = await this.manager.broadcastEval(async (client: Client, { guildId }) => {
			const discordRawGuild = await client.guilds.fetch(guildId).catch(() => null)
			if (!discordRawGuild) return null

			const discordGuild: any = discordRawGuild.toJSON()
			discordGuild.iconURL = discordRawGuild.iconURL()
			discordGuild.bannerURL = discordRawGuild.bannerURL()

			return discordGuild
		}, { context: { guildId: id } })

		const discordGuild = guilds.find(el => el !== null)
		if (!discordGuild) throw new NotFound('Guild not found')

		const databaseGuild = await this.db.get(Guild).findOne({ id })

		return {
			discord: discordGuild,
			database: databaseGuild,
		}
	}

	@Delete('/guilds/:id')
	async deleteGuild(@PathParams('id') id: string) {
		const guilds = await this.manager.broadcastEval(async (client: Client, { guildId }) => {
			const discordRawGuild = await client.guilds.fetch(guildId).catch(() => null)
			if (!discordRawGuild) return false

			await discordRawGuild.leave()

			return true
		}, { context: { guildId: id } })

		if (!guilds.includes(true))
			throw new NotFound('Guild not found')
		else {
			return {
				success: true,
				message: 'Guild deleted',
			}
		}
	}

	@Get('/guilds/:id/invite')
	async invite(@PathParams('id') id: string) {
		const invites = await this.manager.broadcastEval(async (client: Client, { guildId }) => {
			const guild = await client.guilds.fetch(guildId).catch(() => null)
			if (!guild) return null

			const guildChannels = await guild.channels.fetch()

			let invite: any
			for (const channel of guildChannels.values()) {
				if (
					channel
					&& (guild.members.me?.permissionsIn(channel).has(PermissionsBitField.Flags.CreateInstantInvite) || false)
					&& [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildAnnouncement].includes(channel.type)
				) {
					invite = await (channel as BaseGuildTextChannel | BaseGuildVoiceChannel | NewsChannel | undefined)?.createInvite()
					if (invite)
						break
				}
			}

			if (invite)
				return invite.toJSON()
			else
				return false
		}, { context: { guildId: id } })

		if (invites.every(el => el == null)) throw new NotFound('Guild not found')
		if (invites.includes(false)) throw new Unauthorized('Missing permission to create an invite in this guild')

		const cleared = invites.filter(el => el)
		if (cleared.length === 0) throw new Exception(500, 'An unknown error as occurred')

		return cleared[0]
	}

	@Get('/users')
	async users() {
		const users = (await this.manager.broadcastEval(async (client: Client) => {
			const users: any[] = []
			const guilds = client.guilds.cache.values()

			for (const guild of guilds) {
				const members = await guild.members.fetch()

				for (const member of members.values()) {
					if (!users.find(user => user.id === member.id)) {
						const discordUser: any = member.user.toJSON()
						discordUser.iconURL = member.user.displayAvatarURL()
						discordUser.bannerURL = member.user.bannerURL()

						users.push({
							discord: discordUser,
							database: null,
						})
					}
				}
			}

			return users
		})).flat()

		for (let i = 0; i < users.length; i++) {
			users[i].database = await this.db.get(User).findOne({ id: users[i].discord.id })
		}

		return users
	}

	@Get('/users/:id')
	async user(@PathParams('id') id: string) {
		const users = await this.manager.broadcastEval(async (client: Client, { userId }) => {
			const discordRawUser = await client.users.fetch(userId).catch(() => null)
			if (!discordRawUser) return null

			const discordUser: any = discordRawUser.toJSON()
			discordUser.iconURL = discordRawUser.displayAvatarURL()
			discordUser.bannerURL = discordRawUser.bannerURL()

			return discordUser
		}, { context: { userId: id } })

		const discordUser = users.find(el => el !== null)
		if (!discordUser) throw new NotFound('User not found')

		return {
			discord: discordUser,
			database: await this.db.get(User).findOne({ id }),
		}
	}

	@Get('/users/cached')
	async cachedUsers() {
		return (await this.manager.broadcastEval(async (client: Client) => {
			return client.users.cache.map(user => user.toJSON())
		})).flat()
	}

	@Get('/maintenance')
	async maintenance() {
		return {
			maintenance: await isInMaintenance(),
		}
	}

	@Post('/maintenance')
	async setMaintenance(@Required() @BodyParams('maintenance') maintenance: boolean) {
		await setMaintenance(maintenance)

		return {
			maintenance,
		}
	}

	@Get('/devs')
	async devs() {
		return getDevs()
	}

	@Get('/devs/:id')
	async dev(@PathParams('id') id: string) {
		return isDev(id)
	}

}
