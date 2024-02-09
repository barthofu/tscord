import { F } from 'ts-toolbelt'
import { container, InjectionToken } from 'tsyringe'

export async function resolveDependency<T>(token: InjectionToken<T>, interval: number = 500): Promise<T> {
	while (!container.isRegistered(token, true))
		await new Promise(resolve => setTimeout(resolve, interval))

	return container.resolve(token)
}

type Forward<T> = { [Key in keyof T]: T[Key] extends abstract new (...args: any) => any ? InstanceType<T[Key]> : T[Key] }

export async function resolveDependencies<T extends readonly [...unknown[]]>(tokens: F.Narrow<T>) {
	return Promise.all(tokens.map((token: any) =>
		resolveDependency(token)
	)) as Promise<Forward<F.Narrow<T>>>
}
