import { Get, Middleware, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"

import { BaseController } from "@utils/classes"
import { authenticated, botOnline } from "@api/middlewares"
import { Stats } from "@services"
import { User } from "discord.js"

@Router({ options: { prefix: '/bot' }})
@Middleware(
    botOnline,
    authenticated
)
@injectable()
export class BotController extends BaseController {

    constructor(
        private readonly client: Client,
        private readonly stats: Stats
    ) {
        super()
    }

    @Get('/info')
    async user(ctx: Context) {

        const body = {
            user: this.client.user?.toJSON(),
            stats: await this.stats.getTotalStats()
        }

        this.ok(ctx.response, body)
    }

    @Get('/guilds')
    async guilds(ctx: Context) {

        const body = {
            guilds: this.client.guilds.cache.map(guild => guild.toJSON()),
        }

        this.ok(ctx.response, body)
    }

    @Get('/users')
    async users(ctx: Context) {

        const users: User[] = [],
              guilds = this.client.guilds.cache.map(guild => guild)

        for (const guild of guilds) {

            const members = await guild.members.fetch()

            for (const member of members.values()) {
                if (!users.find(user => user.id === member.id)) {
                    users.push(member.user)
                }
            }
        }

        const body = {
            users: users.map(user => user.toJSON()),
        }

        this.ok(ctx.response, body)
    }

    @Get('/cachedUsers')
    async cachedUsers(ctx: Context) {

        const body = {
            users: this.client.users.cache.map(user => user.toJSON()),
        }

        this.ok(ctx.response, body)
    }
}