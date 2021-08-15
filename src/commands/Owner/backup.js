const commandParams = {
    
    name: '',
    aliases: [],
    args: [],
    desc: {
        en: 'Fait une backup du bot dans un salon discord.',
        fr: 'Backup the entire bot in a discord channel.'
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

        if (config.backup.enabled) {
            await client.backup()
            await msg.react('✅')
        }
        else msg.reply('Backup isn\'t enabled')

    }


}