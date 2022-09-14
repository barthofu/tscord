import { injectable } from 'tsyringe'

import { Once, Discord } from '@decorators'


@Discord()
@injectable()
export default class ReadyEvent {

    @Once('ready')
    async readyHandler() {
        console.log("Plugin: Bot ready !")
    }
}