import { singleton } from 'tsyringe'

import { Logger } from '@services'

@singleton()
export class EventManager {

    private _events: Map<string, Function[]> = new Map()

    constructor(
        private logger: Logger
    ) {
    }

    register(event: string, callback: Function): void {
            
        this._events.set(event, [...this._events.get(event) || [], callback])
    }

    async emit(event: string, ...args: any[]): Promise<void> {

        const callbacks = this._events.get(event)

        if (!callbacks) return

        for (const callback of callbacks) {
            
            try {
                await callback(...args)
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.log(error.toString(), 'error', true)
                }
            }
        }
    }
}