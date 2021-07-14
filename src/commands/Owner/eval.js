const commandParams = {
    
    name: '',
    aliases: [],
    args: [],
    desc: {
        'en': 'Eval command.',
        'fr': 'Commande eval.'
    },
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: true,
    cooldown: null

} 

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, rawArgs, cmd) {

        try {
            const code = msg.content.startsWith('```') ? msg.content.replace('```' + config.evalName, '').replace('```', '') : rawArgs.join(' ')
            let evaled = eval(code)
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            //msg.channel.send(this.clean(evaled), {code:'xl'})
        } catch (err) {
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(err)}\n\`\`\``)
        }

    }

    clean (text) {
        if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        else return text
    }

}