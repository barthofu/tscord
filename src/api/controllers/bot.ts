import { Get, Middleware, Post, Router } from "@discordx/koa"
import { Client } from "discordx"
import { Context } from "koa"
import { injectable } from "tsyringe"
import validator, { Joi } from 'koa-context-validator'

import { BaseController } from "@utils/classes"
import { authenticated, botOnline } from "@api/middlewares"
import { User } from "discord.js"
import { generalConfig } from "@config"
import { isInMaintenance, setMaintenance } from "@utils/functions"

@Router({ options: { prefix: '/bot' }})
@Middleware(
    botOnline,
    authenticated
)
@injectable()
export class BotController extends BaseController {

    constructor(
        private readonly client: Client,
    ) {
        super()
    }

    @Get('/info')
    async user(ctx: Context) {

        const body = {
            user: this.client.user?.toJSON(),
            owner: (await this.client.users.fetch(generalConfig.ownerId)).toJSON(),
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

    @Get('/maintenance')
    async maintenance(ctx: Context) {

        const body = {
            maintenance: await isInMaintenance(),
        }

        this.ok(ctx.response, body)
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

        this.ok(ctx.response, body)
    }
}