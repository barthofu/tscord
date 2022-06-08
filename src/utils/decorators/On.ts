import { ClientEvents } from 'discord.js'
import { EventOptions, MethodDecoratorEx, DOn, MetadataStorage } from 'discordx'

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