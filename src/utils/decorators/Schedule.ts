import { container, InjectionToken } from "tsyringe"
import { isValidCron } from "cron-validator"
import { CronJob } from 'cron'

import { generalConfig } from '@configs'

/**
 * Schedule a job to be executed at a specific time (cron)
 * @param cronExpression 
 * @param cronOptions 
 */
export const Schedule = (cronExpression: string) => {

    if (!isValidCron(cronExpression, { alias: true, seconds: true })) throw new Error(`Invalid cron expression: ${cronExpression}`)

    return (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) => {

        console.log(`Scheduling ${propertyKey} to run at ${cronExpression}`)

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

        job.start()
	}
}