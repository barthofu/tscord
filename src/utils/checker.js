const UserPattern   = require("../models/User.js"),
      GuildPattern  = require("../models/Guild.js")

module.exports = {


    
    checkDaily() {

        let day = dateFormat(new Date(), "dd")
        if (day != db.data.get("currentDay").value()) {

            db.data.set("currentDay", day).write()

            //stuff to do each day
            client.updateStats()
            if (config.backup.activated) client.backup()
        }
    },



    checkUser (userID) {

        //check if this user exists in the database, if not it creates it
        if (!db.user.find(val => val.id === userID).value()) {
            //creation
            let user = new UserPattern(bot.users.cache.get(userID))
            db.user.push(user.object).write()
        }
    },



    checkGuild (guildID) {

        //check if this guild exists in the database, if not it creates it (or recovers it from the deleted ones)
        if (!db.guild.get("guilds").has(guildID).value()) {

            if (db.guild.get("deleted").has(guildID).value()) {
                //recover
                db.guild.set(`guilds.${guildID}`, db.guild.get(`deleted.${guildID}`).value()).write()
                db.guild.get(`deleted`).unset(guildID).write()
            } else {
                //creation
                let guild = new GuildPattern(bot.guilds.cache.get(guildID))
                db.guild.set(`guilds.${guildID}`, guild.object).write()
            }
        }
        else if (!bot.guilds.cache.get(guildID)) { //check if guild exists. If no, the guild is deleted

            //deletion
            db.guild.set(`deleted.${guildID}`, db.guild.get(`guilds.${guildID}`).value()).write()
            db.guild.get(`guilds`).unset(guildID).write()
        }
    },



    checkGuilds () {

        bot.guilds.cache.map(guild => {
            this.checkGuild(guild.id)
        })
    }

}