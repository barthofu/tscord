import { singleton } from 'tsyringe'

@singleton()
export class pluginService {

    constructor() {
        console.log("PluginService: loaded !")
    }
}