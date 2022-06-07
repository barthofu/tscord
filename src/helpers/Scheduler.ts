import { singleton } from 'tsyringe'
import cron from 'node-cron'
import { isValidCron } from 'cron-validator'

import { ScheduledJob } from '@core/ScheduledJob'

@singleton()
export class Scheduler {

    private jobs = new Map<string, cron.ScheduledTask>()

    register(job: ScheduledJob) {

        if (!isValidCron(job.cronExpression, { alias: true, seconds: true })) throw new Error(`Invalid cron expression: ${job.cronExpression}`)

        const newJob = cron.schedule(job.cronExpression, job.callback, job.options)
        this.jobs.set(job.name, newJob)
    }

    stop(name: string) {

        const job = this.jobs.get(name)
        if (job) job.stop()
    }

    start(name: string) {

        const job = this.jobs.get(name)
        if (job) job.start()
    }

}