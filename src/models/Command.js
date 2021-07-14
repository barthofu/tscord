module.exports = class Command {

	constructor(
        {   
            name = '',
            aliases = new Array(),
            args = [],
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

        this.info = { name, aliases, args, desc, cooldown }
        this.verification = { enabled, dm, nsfw }
        this.permission = { memberPermission, botPermission, owner }

    }

}
