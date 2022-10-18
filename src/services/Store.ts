import { Store as RxStore } from "rxeta"
import { singleton } from "tsyringe"

interface State {

    authorizedAPITokens: string[]
}

const initialState: State = {
    
    authorizedAPITokens: []
}

@singleton()
export class Store extends RxStore<State> {

    constructor() {
        super(initialState)
    }
}