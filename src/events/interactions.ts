import { Client, Discord, On, ArgsOf } from 'discordx'

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