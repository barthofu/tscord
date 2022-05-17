import { StateStore } from '@core/stores'

type options = {
    nsfw: boolean
    cooldown: number
}

export function registerCommand(name: string, options: options) {

    const { nsfw, cooldown } = options

    StateStore.commands.push({
        name,
        nsfw,
        cooldown
    })
}