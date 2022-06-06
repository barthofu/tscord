import { singleton } from 'tsyringe'
import cron from 'node-cron'
import { ScheduledJob } from '@core/ScheduledJob'

@singleton()
export class Scheduler {

    private jobs = new Map<string, cron.ScheduledTask>()

    register(job: ScheduledJob) {

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