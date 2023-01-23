import { resolveDependency } from '@utils/functions'
import { container, InjectionToken } from 'tsyringe'

export const OnCustom = (event: string) => {

    return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
    ) {

        // associate the context to the function, with the injected dependencies defined
        const oldDescriptor = descriptor.value
        descriptor.value = function(...args: any[]) {
            return this ? oldDescriptor.apply(container.resolve(this.constructor as InjectionToken<any>), args) : oldDescriptor.apply(this, args)
        }

        import('@services').then(async ({ EventManager }) => {

            const eventManager = await resolveDependency(EventManager)
            const callback = descriptor.value.bind(target)

            eventManager.register(event, callback)
        })
    }
}