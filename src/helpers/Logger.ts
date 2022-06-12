import { TextChannel, ThreadChannel, User } from 'discord.js'
import { SimpleCommandMessage } from 'discordx'
import { singleton } from 'tsyringe'
import { constant } from 'case'
import fs from 'fs'

import { formatDate, getTypeOfInteraction, resolveAction, resolveChannel, resolveUser } from '@utils/functions'

import config from '../../config.json'

@singleton()
export class Logger {

    private logPath: string = `${__dirname}/../../logs`
    private levels = ['debug', 'info', 'warn', 'error'] as const

    log(
        level: typeof this.levels[number] = 'info', 
        message: string = '', 
        saveToFile: boolean = false
    ) {

        if (message === '') return
        
        // log in the console
        const templatedLog = `[${formatDate(new Date())}] ${message}`
        console[level](templatedLog)
        
        // save log to file
        if (saveToFile) {

            const fileName = `${this.logPath}/${level}.log`

            // create the folder if it doesn't exist
            if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath)
            // create file if it doesn't exist
            if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, '')

            fs.appendFileSync(fileName, `${templatedLog}\n`)
        }
    }

    logInteraction(interaction: AllInteractions) {

        if (config.logs.interaction.console) {

            const type = constant(getTypeOfInteraction(interaction))
            const action = resolveAction(interaction)
            const channel = resolveChannel(interaction)
            const user = resolveUser(interaction)

            const message = `(${type}) "${action}" ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in ${channel.name}`: ''}${user ? ` by ${user.username}#${user.discriminator}`: ''}`

            const saveToFile = config.logs.interaction.file
    
            this.log('info', message, saveToFile)
        }
    }

    logSimpleCommand(command: SimpleCommandMessage) {

        if (config.logs.simpleCommand.console) {

            const type = 'SIMPLE_COMMAND_MESSAGE'
            const action = resolveAction(command)
            const channel = resolveChannel(command)
            const user = resolveUser(command)

            const message = `(${type}) "${action}" ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in ${channel.name}`: ''}${user ? ` by ${user.username}#${user.discriminator}`: ''}`

            const saveToFile = config.logs.interaction.file
    
            this.log('info', message, saveToFile)
        }
    }

    logNewUser(user: User) {

        if (config.logs.newUser.console) {

            this.log(
                'info',
                `(NEW_USER) ${user.username}#${user.discriminator} (${user.id}) has been added to the db`,
                config.logs.newUser.file
            )
        }
    }
}