import { TextChannel, ThreadChannel } from 'discord.js'
import { singleton } from 'tsyringe'
import fs from 'fs'

import { getTypeOfInteraction, resolveAction, resolveChannel, resolveUser } from '@utils/functions'

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
        const templatedLog = `[${new Date().toISOString()}] ${message}`
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

        if (config.logs.interactions.console) {

            const type = getTypeOfInteraction(interaction)
            const action = resolveAction(interaction)
            const channel = resolveChannel(interaction)
            const user = resolveUser(interaction)

            const message = `(${type}) "${action}" ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in ${channel.name}`: ''}${user ? ` by ${user.username}#${user.discriminator}`: ''}`

            const saveToFile = config.logs.interactions.file
    
            this.log('info', message, saveToFile)
        }
    }
}