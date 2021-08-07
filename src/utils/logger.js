module.exports = {


    
    log (type, args) {

        switch (type) {

            case 'connected':
                this.logWriteInFile(`Connected! (${bot.guilds.cache.size} servers | ${bot.users.cache.size} users)`)
                break

            case 'command': 
                if (config.channels?.logs?.commands) {
                    bot.channels.cache.get(config.channels.logs.commands).send({ embeds: [new MessageEmbed()
                        .setTitle(args.msg.guild?.name || 'DM')
                        .setAuthor(args.msg.author.username, args.msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(args.msg.guild?.iconURL() || null)
                        .setDescription('```\ns!' + args.commandName + '```')
                        .setFooter(`userId: ${args.msg.author.id}\nguildId: ${args.msg.guild?.id || 'dm channel'}`)
                    ] })
                }
                break

            case 'guildCreate': 
                if (config.channels?.logs?.guildCreate) bot.channels.cache.get(config.channels.logs.guildCreate).send(`New server : **${args.guild}** (\`${args.guild.memberCount}\` members)`)
                this.logWriteInFile(`New server : ${args.guild} (${args.guild.memberCount} members)`)
                break

            case 'guildDelete': 
                if (config.channels?.logs?.guildDelete) bot.channels.cache.get(config.channels.logs.guildDelete).send(`Deleted from : **${args.guild}** (\`${args.guild.memberCount}\` members)`)
                this.logWriteInFile(`Deleted from : ${args.guild} (${args.guild.memberCount} members)`)
                break
        }
    },



    logWriteInFile (str) {

        const date = dateFormat(new Date(), 'dd-mm-yyyy HH:MM:ss')
        client.logger.write(`\n[${date}] ➜ ` + str)
    }

}