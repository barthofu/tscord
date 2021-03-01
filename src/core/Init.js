global.
    //npm
    dateFormat    = require('dateformat'),
    fs            = require('fs'),
    //local databases
    db           = {},
    config       = require("../db/config.json"),
    lang         = require("../db/languages.json"),
    //other
    client       = new (require("./Client.js"))(),
    bot          = client.bot,
    MessageEmbed = client.MessageEmbed,
    utils        = new (require("./Utils.js"))(),
    color        = config.colors.default,
    la           = config.language;

module.exports = async () => {

    await client.init();
};