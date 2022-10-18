import { resolveDependency } from "@utils/functions"

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
        import('@services').then(services => {
            resolveDependency(services.WebSocket).then(webSocket => {
                webSocket.addEvent(event, async (socketId, ...args) => {
                    descriptor.value((eventName: string, ...args: any) => {
                        webSocket.emit(socketId, eventName, ...args)
                    }, ...args)
                })
            })
        })
    }
}