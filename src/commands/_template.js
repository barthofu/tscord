const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "",
    aliases: [],
    desc: {
        en: "",
        fr: ""
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

    async run (msg, args, cmd, color) {

        

    }


}