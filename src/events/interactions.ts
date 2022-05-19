import { Interaction } from 'discord.js'
import { Client, Discord, On, ArgsOf } from 'discordx'

import { Guard, NSFW } from "@utils/guards"

@Discord()
export default class {

    @On('interactionCreate')
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>, 
        client: Client
    ) {

        client.executeInteraction(interaction)
    }
}