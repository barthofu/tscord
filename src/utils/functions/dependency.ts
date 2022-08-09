import { container, InjectionToken } from 'tsyringe'

export async function waitForDependency<T>(token: InjectionToken<T>, interval: number = 500): Promise<T> {

    while(!container.isRegistered(token, true)) {
        await new Promise(resolve => setTimeout(resolve, interval))
    }

    return container.resolve(token)
}

export async function waitForDependencies(tokens: any[], interval: number = 500): Promise<any> {

    return Promise.all(tokens.map(token => 
        waitForDependency(token, interval)
    ))
}