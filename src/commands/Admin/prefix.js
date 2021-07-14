const commandParams = {
    
    name: '',
    aliases: [],
    args: [
        {
            name: {
                en: 'new prefix',
                fr: 'nouveau prefix'
            },
            variableName: 'newPrefix',
            type: 'string',
            params: {
                length: 7
            }
        }
    ],
    desc: {
        en: 'Change the prefix of the bot (`default` for the original prefix).',
        fr: 'Change le prefix du bot (`default` pour le prefix originel).'
    },
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: ['ADMINISRATOR'],
    botPermission: [],
    owner: false,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, rawArgs, cmd) {

        client.getGuild(msg.guild.id).set('prefix', args.newPrefix === 'default' ? null : args.newPrefix).write()
        msg.react('✅')

    }


}