const commandParams = {
    
    name: "",
    aliases: [],
    desc: {
        en: "Turn on/off the maintenance mode.",
        fr: "Active ou désactive le mode maintenance."
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

    async run (msg, args, cmd) {

        let updatedObj = db.data.update("maintenance", val => val ? false : new Date().getTime()).write()
        msg.reply(`mode maintenance **${updatedObj.maintenance ? "activé" : "désactivé"}**`)

    }


}