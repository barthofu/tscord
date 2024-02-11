import { snakeCase } from 'change-case'

import { BaseError } from '@/utils/classes'

export class InvalidOptionName extends BaseError {

	constructor(nameOption: string) {
		super(`Name option must be all lowercase with no spaces. '${nameOption}' should be '${snakeCase(nameOption)}'`)
	}

	handle() {
		this.logger.console(this.message, 'error')
		this.kill()
	}

}
