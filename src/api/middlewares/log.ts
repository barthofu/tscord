import { Context, Middleware, PlatformContext } from '@tsed/common'
import chalk from 'chalk'

import { Logger } from '@/services'
import { resolveDependency } from '@/utils/functions'

@Middleware()
export class Log {

	private logger: Logger

	constructor() {
		resolveDependency(Logger).then((logger) => {
			this.logger = logger
		})
	}

	use(@Context() { request }: PlatformContext) {
		// don't log anything if the request has a `logIgnore` query param
		if (!request.query.logIgnore) {
			const { method, url } = request

			const message = `(API) ${method} - ${url}`
			const chalkedMessage = `(${chalk.bold.white('API')}) ${chalk.bold.green(method)} - ${chalk.bold.blue(url)}`

			this.logger.console(chalkedMessage)
			this.logger.file(message)
		} else {
			delete request.query.logIgnore
		}
	}

}
