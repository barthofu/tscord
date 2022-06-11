import { Client, SimpleCommandMessage } from 'discordx'
import { singleton } from 'tsyringe'
import { EntityRepository } from '@mikro-orm/core'
import { constant } from 'case'

import { Database } from '@core/Database'
import { Stat, User } from '@entities'
import { getTypeOfInteraction, resolveAction, resolveChannel, resolveGuild, resolveUser } from '@utils/functions'
import { Schedule } from '@decorators'

@singleton()
export class Stats {

    private statsRepo: EntityRepository<Stat>

    constructor(
        private client: Client,
        private db: Database
    ) {
        this.statsRepo = this.db.getRepo(Stat)
    }

    async register(type: string, value: string, additionalData?: any) {

        const stat = new Stat()
        stat.type = type
        stat.value = value
        if (additionalData) stat.additionalData = additionalData

        await this.statsRepo.persistAndFlush(stat)
    }

    async registerInteraction(interaction: AllInteractions) {

        // we extract data from the interaction
        const type = constant(getTypeOfInteraction(interaction))
        const value = resolveAction(interaction)
        const additionalData = {
            user: resolveUser(interaction)?.id,
            guild: resolveGuild(interaction)?.id,
            channel: resolveChannel(interaction)?.id
        }

        // add it to the db
        await this.register(type, value, additionalData)
    }

    async registerSimpleCommand(command: SimpleCommandMessage) {

        // we extract data from the interaction
        const type = 'SIMPLE_COMMAND_MESSAGE'
        const value = command.name

        // add it to the db
        await this.register(type, value)
    }

    async getDailyStats() {

        const statsObj = {
            TOTAL_USERS: this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
            TOTAL_GUILDS: this.client.guilds.cache.size,
            TOTAL_ACTIVE_USERS: await this.db.getRepo(User).count()
        }

        return statsObj
    }

    @Schedule('0 0 * * *')
    async registerDailyStats() {

        const dailyStats = await this.getDailyStats()
        
        for (const type of Object.keys(dailyStats)) {
            const value = JSON.stringify(dailyStats[type as keyof typeof dailyStats])
            await this.register(type, value)
        }
    }

    async getStats(): Promise<Stat[]> {

        return this.statsRepo.findAll()
    }

}