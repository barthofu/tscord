import { Client, ArgsOf, SimpleCommandMessage } from 'discordx'
import { injectable } from 'tsyringe'

import { Logger, Stats } from '@services'
import { Maintenance } from '@guards'
import { On, Discord, Guard } from '@decorators';
import { getPrefixFromMessage } from '@utils/functions';

@Discord()
@injectable()
export default class {

    constructor(
        private stats: Stats,
        private logger: Logger
    ) {}

    @On('messageCreate')
    @Guard( 
        Maintenance
    )
    async messageCreate(
        [message]: ArgsOf<'messageCreate'>, 
        client: Client
    ) {
       
        const prefix = getPrefixFromMessage(message)
        const command = await client.parseCommand(prefix, message, false)

        if (command && command instanceof SimpleCommandMessage) {

            /**
             * @param {SimpleCommandMessage} command
             */
            client.emit('simpleCommandCreate', command)
        }
    } 
}