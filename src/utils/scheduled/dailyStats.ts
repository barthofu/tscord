import { ScheduledJob } from '@core/ScheduledJob'

export class DailyStats extends ScheduledJob {

    name = 'dailyStats'
    cronExpression = '*/1 * * * *'
    
    callback = async () => {

        console.log(1)
    }
}