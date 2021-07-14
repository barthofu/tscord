module.exports = class {

    async run (guild) {

        checker.checkGuild(guild.id)

        //log
        logger.log('guildDelete', {guild})

    }

}