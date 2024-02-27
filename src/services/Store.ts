import { Store as RxStore } from 'rxeta'

import { apiConfig } from '@/configs'
import { Service } from '@/decorators'

type State = {

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

@Service({
	keepInstanceAfterHmr: true,
})
export class Store extends RxStore<State> {

	constructor() {
		super(initialState)
	}

}
