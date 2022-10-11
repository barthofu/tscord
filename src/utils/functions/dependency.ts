import { container, InjectionToken } from 'tsyringe'

export const resolveDependency = async <T>(token: InjectionToken<T>, interval: number = 500): Promise<T> => {

    while(!container.isRegistered(token, true)) {
        await new Promise(resolve => setTimeout(resolve, interval))
    }

    return container.resolve(token)
}

export const resolveDependencies = async(...tokens: any): Promise<typeof tokens> => {

    return Promise.all(tokens.map((token: any) => 
        resolveDependency(token)
    ))
}