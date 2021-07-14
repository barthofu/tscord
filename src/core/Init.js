global.
    //npm
    dateFormat      = require('dateformat'),
    fs              = require('fs'),
    //local databases
    db              = {},
    config          = require('../../config.json'),
    lang            = require('../db/languages.json'),
    //other
    client          = new (require('./Client'))(),
    bot             = client.bot,
    checker         = require('../utils/checker'),
    logger          = require('../utils/logger')
    MessageEmbed    = client.MessageEmbed,
    CommandPattern  = require('../models/Command'),
    color           = config.colors.default,
    la              = config.language

module.exports = async () => {

    await client.init()
}