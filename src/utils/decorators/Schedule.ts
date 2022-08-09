import { container, InjectionToken } from "tsyringe"
import { isValidCron } from "cron-validator"
import { CronJob } from 'cron'

import { generalConfig } from '@config'
import { waitForDependency } from "@utils/functions"

/**
 * Schedule a job to be executed at a specific time (cron)
 * @param cronExpression - cron expression to use (e.g: "0 0 * * *" will run each day at 00:00)
 * @param jobName - name of the job (the name of the function will be used if it is not provided)
 */
export const Schedule = (cronExpression: string, jobName?: string) => {

    if (!isValidCron(cronExpression, { alias: true, seconds: true })) throw new Error(`Invalid cron expression: ${cronExpression}`)

    return (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) => {
        // associate the context to the function, with the injected dependencies defined
        const oldDescriptor = descriptor.value
        descriptor.value = function(...args: any[]) {
            return oldDescriptor.apply(container.resolve(this.constructor as InjectionToken<any>), args)
        }
                
        const job = new CronJob(
            cronExpression, 
            descriptor.value, 
            null, 
            false, 
            generalConfig.timezone,
            target
        )

        import('@services').then(async services => {
            const scheduler = await waitForDependency(services.Scheduler)
            scheduler.addJob(jobName ?? propertyKey, job)
        })
	}
}