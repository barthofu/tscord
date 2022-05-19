import type { state } from '@utils/types'

// TODO: define if this class is usefull or not

export class DynamicStore {

    private static _states: state = {}

    public static get states() : state {
        return this._states
    }

    public static setState(key: string, value: any) {
        this._states[key] = value
    }

    public static removeState(key: string) {
        delete this._states[key]
    }

    public static getState(key: string) : any {
        return this._states[key]
    }

    public static updateState(key: string, func: (key: string) => any) : any {
        this._states[key] = func(this._states[key])
    }

    public static hasState(key: string) : boolean {
        return this._states.hasOwnProperty(key)
    }

    public static clear() {
        this._states = {}
    }

    public static getStatesKeys() : string[] {
        return Object.keys(this._states)
    }

    public static getStatesValues() : any[] {
        return Object.values(this._states)
    }

    public static getStatesEntries() : [string, any][] {
        return Object.entries(this._states)
    }

    public static getStatesSize() : number {
        return Object.keys(this._states).length
    }

}