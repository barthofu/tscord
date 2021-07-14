const User   = require('../models/User.js'),
      Guild  = require('../models/Guild.js')

module.exports = {


    
    checkDaily() {

        const day = dateFormat(new Date(), 'dd')

        if (day != db.data.get('currentDay').value()) {
            db.data.set('currentDay', day).write()

            //stuff to do each day
            client.updateStats()
            if (config.backup.enabled) client.backup()
        }
    },



    checkUser (userId) {

        //check if this user exists in the database, if not it creates it
        if (!client.getUser(userId).value()) {
            //creation
            const user = new User(bot.users.cache.get(userId))
            db.users.push(user.object).write()
        }
    },



    checkGuild (guildId) {

        const activeMatch = client.getGuild(guildId).value()

        //check if this guild exists in the database, if not it creates it (or recovers it from the deleted ones)
        if (!activeMatch) {

            const deletedMatch = client.getGuild(guildId, 'deleted').value()

            if (deletedMatch) {
                //recover
                db.guilds.get('actives').push(deletedMatch).write()
                db.guilds.get(`deleted`).pull(deletedMatch).write()
            } else {
                //creation
                const guild = new Guild(bot.guilds.cache.get(guildId))
                db.guilds.get('actives').push(guild.object).write()
            }
        }
        else if (!bot.guilds.cache.get(guildId)) { //check if guild exists. If no, the guild is deleted
            //deletion
            db.guilds.get('deleted').push(activeMatch).write()
            db.guilds.get('actives').pull(activeMatch).write()
        }
    },



    checkGuilds () {

        bot.guilds.cache.map(guild => {
            this.checkGuild(guild.id)
        })
    },



    checkCommandArgs: {

        number: {
    
            type: (arg) => !isNaN(arg),
    
            return: (arg) => parseFloat(arg),
    
            //checkers
    
            min: (arg, min) => arg >= min,
    
            max: (arg, max) => arg <= max,
    
            int: (arg, int) => int ? Number.isInteger(parseFloat(arg)) : true
    
        },

        string: {

            type: (arg) => typeof arg === 'string' || arg instanceof String,

            return: (arg) => arg,

            //checkers

            equalsTo: (arg, equalsTo) => {

                const compareStrings = (firstString, secondString) => firstString.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === secondString.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

                if (typeof equalsTo === 'string') return compareStrings(arg, equalsTo)
                else return equalsTo.find(string => compareStrings(arg, string)) ? true : false
            },

            length: (arg, length) => arg.length <= length,

        },

        mention: {

            type: async (arg, msg) => {

                const match = arg.match(/<@!?(\d+)>/)?.[1]
                if (!match) return false
                try {
                    await msg.guild.members.fetch(match)
                }
                catch (e) { return false }

                return true
            },

            return: (arg, msg) => {

                const match = arg.match(/<@!?(\d+)>/)?.[1]
                return msg.guild.members.cache.get(match)
            }

        }

    }

}