import { container } from 'tsyringe'

import { ScheduledJob } from '@core/ScheduledJob'
import { Stats } from '@helpers'

export class DailyStats extends ScheduledJob {

    private stats: Stats

    constructor() {
        super()
        this.stats = container.resolve(Stats)
    }

    name = 'dailyStats'
    cronExpression = '0 0 * * *'
    
    callback = async () => {

        const dailyStats = await this.stats.getDailyStats()
        
        for (const type of Object.keys(dailyStats)) {
            const value = JSON.stringify(dailyStats[type as keyof typeof dailyStats])
            await this.stats.register(type, value)
        }
    }
}