import { Client, ArgsOf } from 'discordx'
import { injectable } from 'tsyringe'

import { Logger, Stats } from '@helpers'
import { Maintenance } from '@guards'
import { On, Guard, Discord } from '@decorators';

@Discord()
@injectable()
export default class MessageCreate {

    constructor(
        private stats: Stats,
        private logger: Logger
    ) {}

    @On("messageCreate")
    @Guard(
        Maintenance
    )
    async messageCreate([message]: ArgsOf<"messageCreate">, client: Client): Promise<void> {

        await client.executeCommand(message, { caseSensitive: false })
    }

}