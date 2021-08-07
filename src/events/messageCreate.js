const cmdCooldown = {}

module.exports = class {

    async run (msg) {

        //check guild
        if (msg.channel.type !== 'DM') checker.checkGuild(msg.guild.id)

        const prefix = client.getPrefix(msg)
        let rawArgs = msg.content.slice(prefix.length).trim().split(/ +/g),
            cmd = rawArgs.shift().toLowerCase()

        //check if message starts with prefix
        if (!msg.content.startsWith(prefix)) {
            //reload command
            if (config.devs.includes(msg.author.id) && msg.content === '.r') client.reload(msg)
            //eval command
            else if (msg.author.id == config.owner && msg.content.startsWith('```'+config.evalName) && msg.content.endsWith('```')) await bot.commands.get('eval').run(msg, rawArgs, cmd)
            return
        }

        //check if user is a bot
        if (msg.author.bot) return

        //check user
        checker.checkUser(msg.author.id)

        for (let command of [...bot.commands.values()]) {

            if (command.info.name == cmd || 
                command.info.aliases.map(val => val.replace('_', '')).includes(cmd) || 
                (command.info.name.includes('/') && msg.content.slice(prefix.length).trim().split(' ').join('/').startsWith(command.info.name))  ||
                command.info.aliases.find(val => msg.content.slice(prefix.length).trim().split(' ').join('/').startsWith(command.info.name.split('/').slice(0, -1).join('/') + '/' + val.replace('_', '')))
                ) {

                //logs and stats
                this.postCommand(command.info.name.split('/').slice(-1)[0], msg)
                logger.log('command', {commandName: command.info.name.split('/').slice(-1)[0], msg}) //faire attention pour les subs commands ici (le nom)

                //basics checks
                if (this.checkBasics(msg, command, la) !== true) return 

                //format args if subcommand
                if (command.info.name.includes('/')) rawArgs = rawArgs.slice(command.info.name.split('/').length - 1) 

                //check args
                let {error, args} = await this.checkArgs(command, rawArgs, msg, la)
                if (error) return msg.reply(`${error}\ne.g: \`${prefix}${command.info.name.split('/').join(' ')} ${command.info.args.map((arg,i) => {
                    const cadre = (i === command.info.args.length - 1 && arg.optional) ? ['[', ']'] : ['<', '>']
                    return `${cadre[0]}${arg.type === 'mention' ? '@': ''}${typeof arg.name === 'object' ? arg.name[la] : arg.name}${cadre[1]}`
                }).join(' ')}\``)

                //remove actual args from the raw args
                rawArgs = rawArgs.slice(Object.keys(args).length)
                    
                //run the command
                await bot.commands
                    .get(command.info.name)
                    .run(
                        msg, //message object
                        args, //formated expected args
                        rawArgs, //array of all the args
                        command.info.name.split('/').slice(-1)[0] //command name
                    )
            }
        }
    }



    checkBasics (msg, command, la) {

        //check maintenance
        if (db.data.get('maintenance').value() && !config.devs.includes(msg.author.id)) return msg.reply(lang['maintenance'][la]) 
        //check user permission
        if ((command.permission.owner || command.permission.memberPermission.filter(permission => !msg.member.hasPermission(client.Permissions.FLAGS[permission])).length > 0) && !config.devs.includes(msg.author.id)) return msg.reply(lang['userMissingPermission'][la])
        //check bot permission
        if (command.permission.botPermission.filter(permission => !msg.channel.permissionsFor(msg.guild.me).has(client.Permissions.FLAGS[permission])).length > 0) return msg.reply(lang['botMissingPermission'][la] + `\n${neededPermission.join(', ')}`)
        //check DM
        if (!command.verification.dm && msg.channel.type === 'DM') return msg.reply(lang['commandNotInDM'][la])
        //check NSFW
        if (command.verification.nsfw && !msg.channel.nsfw) return msg.reply(lang['channelNotNSFW'][la])
        //check if enabled
        if (!command.verification.enabled && !config.devs.includes(msg.author.id)) return msg.reply(lang['commandNotEnabled'][la])
        //check cooldown
        if (command.info.cooldown) {
            //there is a cooldown
            if (!cmdCooldown[command.info.name]) cmdCooldown[command.info.name] = []
            let match = cmdCooldown[command.info.name].find(val => val.id === msg.author.id)
            if (match) {

                if (new Date().getTime() >= match.time + command.info.cooldown) {
                    //remove cooldown
                    cmdCooldown[command.info.name].map(val => {
                        if (val.id === msg.author.id) return val.time = new Date().getTime()
                    })
                }
                //blocked
                else return msg.reply(lang['cooldown'][la] + '**' + Math.ceil((match.time + command.info.cooldown - new Date().getTime())/1000) + '** sec')
            } else cmdCooldown[command.info.name].push({ id: msg.author.id, time: new Date().getTime() })
        }

        return true
    }



    async checkArgs (command, rawArgs, msg, la) {

        let error = null,
            args = {},
            i = 0

        const awaitedLength = command.info.args.slice(-1)[0]?.optional ? command.info.args.length - 1 : command.info.args.length

        if (rawArgs.length < awaitedLength) {
            error = lang['commandArgs']['argsMissing'][la]
            return { error, args }
        }
                
        for (let argConfig of command.info.args) {

            const arg = rawArgs[i++]

            if (!arg) break

            const checkType = await checker.checkCommandArgs[argConfig.type]?.type(arg, msg)
            if (!checkType) error = eval(`new String(\`${lang['commandArgs'][argConfig.type]['type'][la]}\`).toString()`)
            
            if (argConfig.params) {
                for (let param of Object.keys(argConfig.params)) {
                    if (!checker.checkCommandArgs[argConfig.type][param](arg, argConfig.params[param])) {
                        error = eval(`new String(\`${lang['commandArgs'][argConfig.type][param][la]}\`).toString()`)
                        break
                    }
                }
            }

            if (error) break

            try {
                new Function(argConfig.variableName, 'var ' + argConfig.variableName)
            } catch (e)  {
                throw new Error(`Bad formatted arg name. '${argConfig.variableName}' cannot be used as variable name, please name it with the same formating rules than variables names in JS.`)
            }

            args[argConfig.variableName] = checker.checkCommandArgs[argConfig.type]['return'](arg, msg)

        }

        return { error, args }
    }



    postCommand (cmd, msg) {

        //database stats update
        if (!db.stats.get(`actual.commands.details`).has(cmd).value()) db.stats.set(`actual.commands.details.${cmd}`, 0).write()
        db.stats.update('actual.commands.total', val => val + 1).write()
        db.stats.update(`actual.commands.details.${cmd}`, val => val + 1).write()
    
    }

}
