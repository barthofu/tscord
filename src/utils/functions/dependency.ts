import { container, InjectionToken } from 'tsyringe'

export const waitForDependency = async <T>(token: InjectionToken<T>, interval: number = 500): Promise<T> => {

    while(!container.isRegistered(token, true)) {
        await new Promise(resolve => setTimeout(resolve, interval))
    }

    return container.resolve(token)
}

export const waitForDependencies = async (tokens: any[], interval: number = 500): Promise<any> => {

    return Promise.all(tokens.map(token => 
        waitForDependency(token, interval)
    ))
}