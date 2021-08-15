const commandParams = {
    
    name: '',
    aliases: [],
    args: [],
    desc: {
        en: '',
        fr: ''
    },
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, rawArgs, cmd) {

        msg.reply('This is a subcommand!')

    }


}