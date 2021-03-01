const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "maintenance",
    aliases: [],
    desc: {
        en: "",
        fr: ""
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

    async run (msg, args, cmd, color) {

        let updatedObj = db.data.update("maintenance", val => val ? false : new Date().getTime()).write()
        msg.reply(`mode maintenance **${updatedObj.maintenance ? "activé" : "désactivé"}**`)

    }


}