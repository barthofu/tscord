import { ArgsOf, Client } from 'discordx'

import { On, Discord } from '@decorators'

@Discord()
export default class TemplateReadyEvent {

    // =============================
    // ========= Handlers ==========
    // =============================

    @On('templateReady')
    async templateReadyHandler(
        [arg]: any,
        client: Client
    ) {

       console.log('templateReady event triggered!')
    }

}