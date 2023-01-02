import { apiConfig, websocketConfig } from "@config"
import { Store as RxStore } from "rxeta"
import { singleton } from "tsyringe"

interface State {

    authorizedAPITokens: string[]
    ready: {
        bot: boolean | null
        api: boolean | null
        websocket: boolean | null
    }
}

const initialState: State = {
    
    authorizedAPITokens: [],
    ready: {
        bot: false,
        api: apiConfig.enabled ? false : null,
        websocket: websocketConfig.enabled ? false : null,
    }
}

@singleton()
export class Store extends RxStore<State> {

    constructor() {
        super(initialState)
    }
}