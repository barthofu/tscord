import { container, InjectionToken } from 'tsyringe'

/**
 * Handle websocket events
 * @param event - event name
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 *
 * @category Decorator
 */
export const WSOn = (event: string) => {

    return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
    ) {

        // associate the context to the function, with the injected dependencies defined
        const oldDescriptor = descriptor.value
        descriptor.value = function(...args: any[]) {
            return oldDescriptor.apply(container.resolve(target.constructor as InjectionToken<any>), args)
        }

        import('@services').then(services => {

            const webSocket = container.resolve(services.WebSocket)
        
            webSocket.socket.on(event, async (socketId, ...args) => {
                descriptor.value((eventName: string, ...args: any) => {
                    webSocket.socket.emit('request', socketId, eventName, ...args)
                }, ...args)
            })
        })
    }
}