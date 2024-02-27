import { CronJob } from 'cron'

import { Service } from '@/decorators'

@Service()
export class Scheduler {

	private _jobs: Map<string, CronJob> = new Map()

	get jobs() {
		return this._jobs
	}

	addJob(jobName: string, job: CronJob) {
		this._jobs.set(jobName, job)
	}

	startJob(jobName: string) {
		this._jobs.get(jobName)?.start()
	}

	stopJob(jobName: string) {
		this._jobs.get(jobName)?.stop()
	}

	stopAllJobs() {
		this._jobs.forEach(job => job.stop())
	}

	startAllJobs() {
		this._jobs.forEach(job => job.start())
	}

}
