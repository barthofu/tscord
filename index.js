let 
    Discord = require('discord.js'),
    low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync')

global.
    //npm
    bot = new Discord.Client(),
    fs = require('fs'),
    //additionnal npm
    dateFormat = require('dateformat'),
    //local databases
    db = {},
    config = require("./db/config.json"),
    lang = require("./db/languages.json"),
    //other
    MessageEmbed = Discord.MessageEmbed, //makes it global
    client = new (require("./base/Client.js"))(),
    color = config.colors.default,
    la = config.language

//commands ===========================================================================================
bot.commands = new Discord.Collection()
let categories = fs.readdirSync(`${__dirname}/commands`)
for (i in categories) {
    fs.readdirSync(`${__dirname}/commands/${categories[i]}`).filter(file => file.endsWith('.js')).forEach(file => {
        const command = new (require(`./commands/${categories[i]}/${file}`))();
        bot.commands.set(command.info.name, command);
        delete require.cache[require.resolve(`./commands/${categories[i]}/${file}`)];
    })
}

//databases ==========================================================================================
fs.readdirSync(`${__dirname}/db`).filter(file => file.endsWith('.json')).forEach(file => {
    let adapter = new FileSync(`${__dirname}/db/${file}`);
    db[file.replace(".json", "")] = low(adapter);
})

//events =============================================================================================

fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js')).forEach(file => {
    const eventName = file.split(".")[0]
    bot.on(eventName, (...args) => new (require(`./events/${file}`))(...args).run())
    delete require.cache[require.resolve(`./events/${file}`)]
})

//logging with token
bot.login(config.token)


