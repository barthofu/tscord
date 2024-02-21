import { Middleware } from "@tsed/common"
import { InternalServerError } from "@tsed/exceptions"
import { resolveDependencies } from "@utils/functions"
import { Client } from "discordx"

@Middleware()
export class BotOnline {

    private client: Client

    constructor() {

        resolveDependencies([Client]).then(([client]) => {
            this.client = client
        })
    }

    async use() {

        if (this.client.user?.presence.status === 'offline') throw new InternalServerError('Bot is offline')
    }

}