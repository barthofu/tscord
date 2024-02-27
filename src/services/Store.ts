import { Store as RxStore } from 'rxeta'
import { singleton } from 'tsyringe'

import { apiConfig } from '@/configs'

interface State {

	authorizedAPITokens: string[]
	botHasBeenReloaded: boolean
	ready: {
		bot: boolean | null
		api: boolean | null
	}
}

const initialState: State = {

	authorizedAPITokens: [],
	botHasBeenReloaded: false,
	ready: {
		bot: false,
		api: apiConfig.enabled ? false : null,
	},
}

@singleton()
export class Store extends RxStore<State> {

	constructor() {
		super(initialState)
	}

}
