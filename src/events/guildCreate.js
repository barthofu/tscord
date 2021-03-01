module.exports = class {

    async run (guild) {

        client.checkGuild(guild.id)

        //log
        client.log("guildCreate", {guild});

    }

}