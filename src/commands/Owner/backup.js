const commandParams = {
    
    name: "",
    aliases: [],
    desc: {
        en: "Fait une backup du bot dans un salon discord.",
        fr: "Backup the entire bot in a discord channel."
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

        await client.backup()

    }


}