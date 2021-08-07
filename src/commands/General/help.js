const commandParams = {
    
    name: '',
    aliases: ['h'],
    args: [],
    desc: {
        en: 'Displays the help of the bot.',
        fr: 'Affiche l\'aide du bot.'
    },
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: 4000

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, rawArgs, cmd) {

        const prefix = client.getPrefix(msg)

        const embed = new MessageEmbed()
            .setTitle(lang['help']['title'][la])
            .setColor(color)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/a/a4/Cute-Ball-Help-icon.png')

        const categories = [...new Set(bot.commands.map(command => command.info.categoryName))]

        for (let category of categories) {

            const content = bot.commands.filter(command => command.info.categoryName === category).map(command =>
                command.verification.enabled == true && command.permission.owner == false ? 
                    `\`${prefix}${command.info.name.split('/').join(' ')}${command.info.args.map((arg,i) => {
                        const cadre = (i === command.info.args.length - 1 && arg.optional) ? ['[', ']'] : ['<', '>']
                        return ` ${cadre[0]}${arg.type === 'mention' ? '@': ''}${typeof arg.name === 'object' ? arg.name[la] : arg.name}${cadre[1]}`
                    }).join(' ')}\`${command.info.aliases.filter(val => !val.startsWith('_')).length > 0 ? ` (ou ${command.info.aliases.filter(val => !val.startsWith('_')).map(val => `\`${prefix}${val}\``).join(' | ')})`:''} | ${this.checkCommand(command)} ${command['info']['desc'][la]}\n` : ''
            ).join('')

            if (content.length > 0) embed.addField(category, content)
        }

        msg.channel.send({ embeds: [embed] })

    }

    checkCommand (command) {
        
        let text = ''
        if (command.verification.nsfw == true) text+='[**NSFW**] '
        if (command.permission.memberPermission.includes('ADMINISTRATOR')) text+='[**ADMIN**] '
        if (command.info.cooldown !== null) text+=`[**${command.info.cooldown}** sec] `
        return text
    }

}