import { Interaction } from 'discord.js'
import { Client, Discord, On } from 'discordx'

@Discord()
export default class {

    @On('interactionCreate')
    async interactionCreate(rawInteraction: Interaction | Interaction[], client: Client) {

        const interaction: Interaction = rawInteraction instanceof Array ? rawInteraction[0] : rawInteraction

        client.executeInteraction(interaction)
    }
}