import { Message } from 'discord.js'

import { generalConfig } from '@config'

const clean = (text: any) => {
    if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
    else return text
}

/**
 * Eval a code snippet extracted from a Discord message.
 * @param message - Discord message containing the code to eval
 */
export const executeEvalFromMessage = (message: Message) => {

    try {

        const code = message.content.replace('```' + generalConfig.eval.name, '').replace('```', '')
        
        let evaled = eval(code)
        
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)

    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
    }

}