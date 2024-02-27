import { autoInjectable } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types'

export function AutoInjectable<T>() {
	return function (target: constructor<T>) {
		return autoInjectable()(target)
	}
}
