import { resolveDependency } from '@utils/functions'

export const OnCustom = (event: string) => {

    return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
    ) {

        import('@services').then(async ({ EventManager }) => {

            const eventManager = await resolveDependency(EventManager)

            eventManager.register(event, descriptor.value)
        })
    }
}