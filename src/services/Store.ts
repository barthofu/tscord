import { singleton } from 'tsyringe'
import { Store as RxStore } from 'rxeta'

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