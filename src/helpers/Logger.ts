import { TextChannel, ThreadChannel } from 'discord.js'
import { singleton } from 'tsyringe'
import fs from 'fs'

import { getTypeOfInteraction, resolveAction, resolveChannel, resolveUser } from '@utils/functions'
import { allInteractionTypes } from '@utils/types'

import config from '../../config.json'

@singleton()
export class Logger {

    private logFile: string = `${__dirname}/../../app.log`

    log(
        message: string = '', 
        type: string = 'info', 
        saveToFile: boolean = false
    ) {
        
        // log in the console
        const templatedLog = `[${new Date().toISOString()}] ${message}`
        if (type === 'info') console.info(templatedLog)
        else if (type === 'error') console.error(templatedLog)
        else console.log(templatedLog)
        
        // save log to file
        if (saveToFile) {

            // create file if it doesn't exist
            if (!fs.existsSync(this.logFile)) {
                fs.writeFileSync(this.logFile, "")
            }

            fs.appendFileSync(this.logFile, `${templatedLog}\n`)
        }
    }

    logInteraction(interaction: allInteractionTypes) {

        if (config.logs.interactions.console) {

            const type = getTypeOfInteraction(interaction)
            const action = resolveAction(interaction)
            const channel = resolveChannel(interaction)
            const user = resolveUser(interaction)
    
            this.log(
                `(${type}) "${action}" ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in ${channel.name}`: ''}${user ? ` by ${user.username}#${user.discriminator}`: ''}`,
                'info',
                config.logs.interactions.file
            )
        }
    }
}