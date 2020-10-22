module.exports = class Command {

	constructor(
        {   
            name = null,
            aliases = new Array(),
            desc = null,
            enabled = true,
            dm = true,
            nsfw = false,
            memberPermission = new Array(),
            botPermission = new Array(),
            owner = false,
            cooldown = null 
        }
    ) {

        this.info = { name, aliases, desc, cooldown }
        this.verification = { enabled, dm, nsfw }
        this.permission = { memberPermission, botPermission, owner }

    }

}
