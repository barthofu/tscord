const CommandPattern = require("../../base/Command.js");

const commandParams = {
    
    name: "info",
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
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd) {

        msg.channel.send("info")
    

    }


}