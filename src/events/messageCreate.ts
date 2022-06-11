import { Client, ArgsOf } from 'discordx'
import { injectable } from 'tsyringe'

import { Logger, Stats } from '@helpers'
import { Maintenance } from '@guards'
import { On, Guard, Discord } from '@decorators'

import config from '../../config.json'
import { executeEval } from '@utils/functions'

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

        // eval command
        if (
            message.content.startsWith(`\`\`\`${config.eval.name}`)
            && (
                (!config.eval.onlyOwner && config.devs.includes(message.author.id))
                || (config.eval.onlyOwner && message.author.id === config.owner)
            )
        ) {
            executeEval(message)
        }

        await client.executeCommand(message, { caseSensitive: false })
    }

}