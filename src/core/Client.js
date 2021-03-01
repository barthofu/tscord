const low           = require('lowdb'),
      FileSync      = require('lowdb/adapters/FileSync'),
      UserPattern   = require("../models/User.js"),
      GuildPattern  = require("../models/Guild.js"),
      Discord       = require('discord.js'),
      credentials   = require("../../.credentials.json"),
      process       = require('process');
const { config } = require('process');


module.exports = class {

    constructor () {

        try {
            process.chdir(__dirname + "/../../" )
        } catch (e) {
            throw new Error("Couldn't change folder location!")
        }

        this.bot = new Discord.Client({"restTimeOffset": 100});
        this.bot.commands = new Discord.Collection();
        this.MessageEmbed = Discord.MessageEmbed;
    }



    async init () {

        this.loadCommands();
        this.loadEvents();
        this.loadJSON();
        this.loadLogs();

        this.login();
    }



    login () { this.bot.login(credentials.token);  }



    loadJSON () {

        fs.readdirSync(`./src/db`).filter(val => val.endsWith(".json")).forEach(file => {
            let adapter = new FileSync(`./src/db/${file}`);
            db[file.replace(".json", "")] = low(adapter);
        });
    }



    loadLogs () {

        this.logger = fs.createWriteStream('./logs.txt', {
            flags: 'a'
        })
    }



    loadEvents () {

        fs.readdirSync(`./src/events`).filter(file => file.endsWith('.js')).forEach(file => {
            const eventName = file.split(".")[0];
            const eventClass = new (require(`../events/${file}`))();
            this.bot.on(eventName, (...args) => eventClass.run(...args));
            delete require.cache[require.resolve(`../events/${file}`)];
        })
    }



    updateStats () {

        let date = dateFormat(new Date(new Date().getTime() - 60 * 60 * 24), "dd-mm-yyyy");
        db.stats.get("daily").push(Object.assign(
            { date: date },
            this.getStats()
        )).write();
    }



    getStats() {

        return {
            
            guilds: bot.guilds.cache.size,
            users: bot.users.cache.size,
            activeUsers: db.user.size().value(),
            commands: {
                total: db.stats.get("actual.commands.total").value(),
                details: db.stats.get("actual.commands.details").value()
            }
        }
    }



    loadCommands () {

        let categories = fs.readdirSync(`./src/commands`).filter(file => !file.includes("."));
        for (let i in categories) {
            fs.readdirSync(`./src/commands/${categories[i]}`).filter(file => file.endsWith('.js') && !file.startsWith("_")).forEach(file => {
                const command = new (require(`../commands/${categories[i]}/${file}`))();
                this.bot.commands.set(command.info.name, command);
                delete require.cache[require.resolve(`../commands/${categories[i]}/${file}`)];
            });
        }
    }



    checkDaily() {

        let day = dateFormat(new Date(), "dd");
        console.log(day)
        if (day != db.data.get("currentDay").value()) {

            db.data.set("currentDay", day).write();

            this.updateStats();
        }
    }



    checkUser (userID) {
        //check if this user exists in the database, if not it creates it
        if (!db.user.find(val => val.id === userID).value()) {
            //creation
            let user = new UserPattern(bot.users.cache.get(userID));
            db.user.push(user.object).write();
        }
    }



    checkGuild (guildID) {

        //check if this guild exists in the database, if not it creates it (or recovers it from the deleted ones)
        if (!db.guild.get("guilds").has(guildID).value()) {
            if (db.guild.get("deleted").has(guildID).value()) {
                //recover
                db.guild.set(`guilds.${guildID}`, db.guild.get(`deleted.${guildID}`).value()).write();
                db.guild.get(`deleted`).unset(guildID).write();
            } else {
                //creation
                let guild = new GuildPattern(bot.guilds.cache.get(guildID));
                db.guild.set(`guilds.${guildID}`, guild.object).write();
            }
        }
    }



    checkGuilds () {

        this.bot.guilds.cache.map(guild => {
            this.checkGuild(guild.id)
        })
    }



    async reload (msg) {

        //reload commands and local json
        this.loadCommands();
        this.loadJSON();

        console.log("\n\n============================\n\nAll the commands and databases has been reloaded!\n\n============================\n\n");
        msg.react('✅');
    }



    log (type, args) {

        switch (type) {

            case "connected":
                this.logWriteInFile(`Connected! (${bot.guilds.cache.size} servers | ${bot.users.cache.size} users)`);
                break;

            case "command": 
                if (config.channels?.logs?.commands) {
                    bot.channels.cache.get(config.channels.logs.commands).send(new MessageEmbed()
                        .setTitle(args.msg.guild?.name || "DM")
                        .setAuthor(args.msg.author.username, args.msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(args.msg.guild?.iconURL() || null)
                        .setDescription("```\ns!" + args.commandName + "```")
                        .setFooter(`userId: ${args.msg.author.id}\nguildId: ${args.msg.guild?.id || "dm channel"}`)
                    );
                }
                break;

            case "guildCreate": 
                if (config.channels?.logs?.guildCreate) bot.channels.cache.get(config.channels.logs.guildCreate).send(`New server : **${args.guild}** (\`${args.guild.memberCount}\` members)`);
                this.logWriteInFile(`New server : ${args.guild} (${args.guild.memberCount} members)`);
                break;

            case "guildDelete": 
                if (config.channels?.logs?.guildDelete) bot.channels.cache.get(config.channels.logs.guildDelete).send(`Deleted from : **${args.guild}** (\`${args.guild.memberCount}\` members)`);
                this.logWriteInFile(`Deleted from : ${args.guild} (${args.guild.memberCount} members)`);
                break;
        }
    }



    logWriteInFile (str) {

        let date = dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss");
        client.logger.write(`\n[${date}] ⫸ ` + str)
    }



    startingConsole () {
        
        let params = {
            categories: fs.readdirSync(`./src/commands`).filter(file => !file.includes(".")).length,
            commands: bot.commands.size,
            databases: Object.keys(db).length,
            events: fs.readdirSync("./src/events").filter(file => file.endsWith('.js')).length
        }

        console.log(`\u200b\n\u200b\n\u200b\n\u200b\n\u200b\t\t╔═════════════════════════════════════╗\n\u200b\t\t║ ${bot.user.username} is connected!${new Array(Math.abs(22-bot.user.username.length)).fill(" ").join("")}║\n\u200b\t\t╚═════════════════════════════════════╝\n\u200b\t\t\t\t• • •\n\u200b`);
        console.log(`› ${params.commands} commands loaded${config.startingConsoleDetailed==true?"\n"+fs.readdirSync("./src/commands").filter(file => !file.includes(".")).map(
            val => `\u200B\t› ${val}\n${fs.readdirSync("./src/commands/"+val).map(
                val2 => `\u200B\t    \u200b› ${val2.split(".")[0]}`
                ).join("\r\n")}`
            ).join("\r\n"):""}`);
        console.log(`› ${params.databases} databases loaded (JSON)${config.startingConsoleDetailed==true?"\n"+Object.keys(db).map(val => `\u200B\t› ${val}`).join("\r\n"):""}`);
        console.log(`› ${params.events} events loaded${config.startingConsoleDetailed==true?"\n"+fs.readdirSync("./src/events").filter(file => file.endsWith('.js')).map(val => `\u200B\t› ${val.replace('.js', '')}`).join("\r\n"):""}\n\u200b\t\t\t\t• • •\n\u200b`);
    }




}