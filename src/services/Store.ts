import { singleton } from 'tsyringe'
import { Store as RxStore } from 'rxeta'

interface State {
    counter: number
}

const initialState: State = {
    counter: 0
}

@singleton()
export class Store extends RxStore<State> {

    constructor() {
        super(initialState)
    }
}