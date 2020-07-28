const CommandPattern = require("../../base/Command.js");

const commandParams = {
    
    name: "help",
    aliases: ["h"],
    desc: {
        en: "Displays the help of the bot.",
        fr: "Affiche l'aide du bot."
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

    async run (msg, args, cmd) {

        let embed = new MessageEmbed()
        .setTitle(lang["help"]["title"][la])
        .setAuthor(msg.author.username, msg.author.displayAvatarURL())
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/a/a4/Cute-Ball-Help-icon.png")
        .setFooter("a")
        
        let categories = fs.readdirSync(`./commands`)
        categories.forEach(category => {
            embed.addField(`${category}`, fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith(".js")).map(
                    commandName => {
                        let command = bot.commands.get(commandName.split(".")[0])
                        return command.verification.enabled == true || command.permission.owner == false?`\`${db.guild.get(`guilds.${msg.guild.id}.prefix`).value()}${commandName.split(".")[0]}\`${command.info.aliases.length > 0?` (${command.info.aliases.map(val => `\`${val}\``).join(" | ")})`:""} | ${command["info"]["desc"][la]} ${this.checkCommand(command)}`:""
                    } 
                ).join("\r\n")
            )
        })

        msg.channel.send(embed)

    }

    checkCommand (command) {
        let text = ""
        if (command.verification.nsfw == true) text+="[**NSFW**] "
        if (command.permission.member.includes("ADMINISTRATOR")) text+="[**ADMIN**] "
        if (command.info.cooldown !== null) text+=`[**${command.info.cooldown}** sec] `
        return text
    }

}