const
      Discord       = require('discord.js'),
      credentials   = require("../../.credentials.json"),
      process       = require("process"),
      loader        = require("../utils/loader"),
      colors        = require("colors"),
      archiver      = require('archiver')

module.exports = class {

    constructor () {

        try {
            process.chdir(__dirname + "/../../" )
        } catch (e) {
            throw new Error("Couldn't change folder location!")
        }

        this.bot = new Discord.Client({"restTimeOffset": 100})
        this.bot.commands = new Discord.Collection()
        this.MessageEmbed = Discord.MessageEmbed
    }



    async init () {

        loader.loadCommands()
        loader.loadEvents()
        loader.loadJSON()
        loader.loadLogs()

        this.login()
    }



    login () { this.bot.login(credentials.token)  }


    
    updateStats () {

        let date = dateFormat(new Date(new Date().getTime() - 60 * 60 * 24), "dd-mm-yyyy")
        db.stats.get("daily").push(Object.assign(
            { date: date },
            this.getStats()
        )).write()
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



    async backup () {

        let botName = bot.user.username.split(' ').join('_')
        let archiveName = `./${botName}_backup_${dateFormat(new Date(), 'dd-mm-yyyy')}.zip`

        try {

            if (!bot.channels.cache.get(config.backup.channel)) {
                this.bot.users.cache.get(config.ownerID).send("Backup has failed: no discord channel to send the backup (set it in the config.json file).")
                return
            }
        
            await this.zipDirectory(archiveName)
            await this.bot.channels.cache.get(config.backup.channel).send('', { files: [archiveName] })
            await fs.unlinkSync(archiveName)

        } catch (e) {

            this.bot.users.cache.get(config.ownerID).send("There was a problem during backup. Check the console.")
            console.log(e)
        }

    }



    zipDirectory(out) {

        const archive = archiver('zip', { zlib: { level: 9 }});
        const stream = fs.createWriteStream(out);
        const projectDir = fs.readdirSync('.')
      
        return new Promise((resolve, reject) => {
            archive
                //.directory(source, false)
                .on('error', err => reject(err))
                .pipe(stream)

            for (let dir of projectDir) {

                console.log("==============\n"+dir)

                if (!config.backup.ignoredPaths.includes(dir)) {

                    console.log('validated')
                    
                    //file
                    if (dir.includes('.') && !dir.startsWith('.')) archive.glob(dir)
                    //folder
                    else archive.glob(dir + '/**')
                    
                }

            }
        
            stream.on('close', () => resolve());
            archive.finalize();
        });
    }



    async reload (msg) {

        //reload commands and local json
        loader.loadCommands()
        loader.loadJSON()

        console.log("\n\n============================\n\nAll the commands and databases has been reloaded!\n\n============================\n\n")
        msg.react('✅')
    }



    startingConsole () {
        
        let params = {
            categories: fs.readdirSync(`./src/commands`).filter(file => !file.includes(".")).length,
            commands: bot.commands.size,
            databases: Object.keys(db).length,
            events: fs.readdirSync("./src/events").filter(file => file.endsWith('.js')).length
        }

        console.log(`\u200b\n\u200b\n\u200b\n\u200b\n\u200b\t\t╔═════════════════════════════════════╗\n\u200b\t\t║ ` + `${bot.user.username}`.green.bold + ` is connected!`.green + `${new Array(Math.abs(22-bot.user.username.length)).fill(" ").join("")}║\n\u200b\t\t╚═════════════════════════════════════╝\n\u200b\t\t\t\t• • •\n\u200b`)
        console.log(`› ${params.commands} commands loaded`.blue + `${config.startingConsoleDetailed==true?"\n"+fs.readdirSync("./src/commands").filter(file => !file.includes(".")).map(
            val => `\u200B\t› ${val}\n${fs.readdirSync("./src/commands/"+val).map(
                val2 => `\u200B\t    \u200b› ${val2.split(".")[0]}`
                ).join("\r\n")}`
            ).join("\r\n"):""}`.grey)
        console.log(`› ${params.databases} databases loaded (JSON)`.yellow + `${config.startingConsoleDetailed==true?"\n"+Object.keys(db).map(val => `\u200B\t› ${val}`).join("\r\n"):""}`.grey)
        console.log(`› ${params.events} events loaded`.red + `${config.startingConsoleDetailed==true?"\n"+fs.readdirSync("./src/events").filter(file => file.endsWith('.js')).map(val => `\u200B\t› ${val.replace('.js', '')}`).join("\r\n"):""}`.grey + "\n\u200b\t\t\t\t• • •\n\u200b")
    }

}