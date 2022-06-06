import cron from 'node-cron'

const defaultScheduleOptions = {
    scheduled: true,
    timezone: 'Europe/Paris'
}

export class ScheduledJob {

    readonly name: string
    readonly cronExpression: string
    readonly callback: () => void
    readonly options: cron.ScheduleOptions = defaultScheduleOptions
}