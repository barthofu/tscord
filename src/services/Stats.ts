import { Client, SimpleCommandMessage } from 'discordx'
import { singleton } from 'tsyringe'
import { EntityRepository } from '@mikro-orm/core'
import { constant } from 'case'
import { DateTime } from 'luxon'

import { Database } from '@services'
import { Stat, User } from '@entities'
import { formatDate, getTypeOfInteraction, resolveAction, resolveChannel, resolveGuild, resolveUser } from '@utils/functions'
import { Schedule } from '@decorators'

import { statsConfig } from '@config'

@singleton()
export class Stats {

    private statsRepo: EntityRepository<Stat>

    constructor(
        private client: Client,
        private db: Database
    ) {
        this.statsRepo = this.db.getRepo(Stat)
    }

    /**
     * Add an entry to the stats table.
     * @param type 
     * @param value 
     * @param additionalData in JSON format
     */
    async register(type: string, value: string, additionalData?: any) {

        const stat = new Stat()
        stat.type = type
        stat.value = value
        if (additionalData) stat.additionalData = additionalData

        await this.statsRepo.persistAndFlush(stat)
    }

    /**
     * Record an interaction and add it to the database.
     * @param interaction 
     * @returns 
     */
    async registerInteraction(interaction: AllInteractions) {

        // we extract data from the interaction
        const type = constant(getTypeOfInteraction(interaction)) as InteractionsConstants
        if (statsConfig.interaction.exclude.includes(type)) return
        
        const value = resolveAction(interaction)
        const additionalData = {
            user: resolveUser(interaction)?.id,
            guild: resolveGuild(interaction)?.id || 'dm',
            channel: resolveChannel(interaction)?.id
        }

        // add it to the db
        await this.register(type, value, additionalData)
    }

    /**
     * Record a simple command message and add it to the database.
     * @param command 
     */
    async registerSimpleCommand(command: SimpleCommandMessage) {

        // we extract data from the interaction
        const type = 'SIMPLE_COMMAND_MESSAGE'
        const value = command.name
        const additionalData = {
            user: command.message.author.id,
            guild: command.message.guild?.id || 'dm',
            channel: command.message.channel?.id
        }

        // add it to the db
        await this.register(type, value, additionalData)
    }

    /**
     * Returns an object with the total stats for each type
     */
    async getTotalStats() {

        const totalStatsObj = {
            TOTAL_USERS: this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
            TOTAL_GUILDS: this.client.guilds.cache.size,
            TOTAL_ACTIVE_USERS: await this.db.getRepo(User).count(),
            TOTAL_COMMANDS: await this.statsRepo.count({ 
                $or: [ 
                    { type: 'SIMPLE_COMMAND_MESSAGE' }, 
                    { type: 'COMMAND_INTERACTION' }
                ] 
            })
        }

        return totalStatsObj
    }

    /**
     * Returns the amount of row for a given type per day in a given interval of days from now.
     * @param type 
     * @param days 
     */
    async getStatPerDays(type: string, days: number): Promise<StatPerInterval> {

        const now = Date.now()
        const stats: StatPerInterval = []

        for (let i = 0; i < days; i++) {

            const date = new Date(now - (i * 24 * 60 * 60 * 1000))
            const statCount = await this.getCountForGivenDay(type, date)

            stats.push({
                date: formatDate(date, 'onlyDate'),
                count: statCount
            })
        }

        return this.cummulateStatPerInterval(stats)
    }

    /**
     * Transform individual day stats into cumulated stats.
     * @param stats 
     */
    cummulateStatPerInterval(stats: StatPerInterval): StatPerInterval {

        const cummulatedStats = 
            stats
                .reverse()
                .reduce((acc, stat, i) => {

                    if (acc.length === 0) acc.push(stat)
                    else acc.push({
                        date: stat.date,
                        count: acc[i - 1].count + stat.count
                    })
                
                    return acc
                }, [] as StatPerInterval)
                .reverse()

        return cummulatedStats
    }

    /**
     * Sum two array of stats.
     * @param stats1 
     * @param stats2 
     * @returns 
     */
    sumStats(stats1: StatPerInterval, stats2: StatPerInterval): StatPerInterval {

        const allDays = [...new Set(stats1.concat(stats2).map(stat => stat.date))]
            .sort((a, b) => {
                var aa = a.split('/').reverse().join(),
                    bb = b.split('/').reverse().join();
                return aa < bb ? -1 : (aa > bb ? 1 : 0);
            })

        const sumStats = allDays.map(day => ({
            date: day,
            count: 
            (stats1.find(stat => stat.date === day)?.count || 0) 
            + (stats2.find(stat => stat.date === day)?.count || 0)
        }))

        return sumStats
    }

    /**
     * Returns the total count of row for a given type at a given day.
     * @param type 
     * @param date - day to get the stats for (any time of the day will work as it extract the very beginning and the very ending of the day as the two limits)
     */
    async getCountForGivenDay(type: string, date: Date): Promise<number> {

        const start = DateTime.fromJSDate(date).startOf('day').toJSDate()
        const end = DateTime.fromJSDate(date).endOf('day').toJSDate()

        const stats = await this.statsRepo.find({
            type,
            createdAt: {
                $gte: start,
                $lte: end
            }   
        })

        return stats.length
    }

    /**
     * Run each day at 23:59 to update daily stats
     */
    @Schedule('59 23 * * *')
    async registerDailyStats() {

        const totalStats = await this.getTotalStats()
        
        for (const type of Object.keys(totalStats)) {
            const value = JSON.stringify(totalStats[type as keyof typeof totalStats])
            await this.register(type, value)
        }
    }

}