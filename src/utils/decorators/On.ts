import { ClientEvents } from 'discord.js'
import { EventOptions, MethodDecoratorEx, DOn, MetadataStorage, On as Onx } from 'discordx'

/**
 * Handle both discord and custom events with a defined handler
 * @param event - event name
 * @param options - event parameters
 * ___
 *
 * [View Documentation](https://discord-ts.js.org/docs/decorators/general/on)
 *
 * @category Decorator
 */
export const On = (event: string, options?: EventOptions): MethodDecoratorEx => {

    return function <T>(
        target: Record<string, T>,
        key: string,
        descriptor?: PropertyDescriptor
    ) {

        const clazz = target as unknown as new () => unknown
        const on = DOn.create(event as (keyof ClientEvents), false, options?.botIds).decorate(
            clazz.constructor,
            key,
            descriptor?.value
        )

        MetadataStorage.instance.addOn(on)
    }
}