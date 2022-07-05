import { Guild, TextChannel, ThreadChannel, User } from 'discord.js'
import { Client, MetadataStorage, SimpleCommandMessage } from 'discordx'
import { MetadataStorage as KoaMetadataStorage } from '@discordx/koa'
import { container, delay, inject, singleton } from 'tsyringe'
import { constant } from 'case'
import fs from 'fs'
import chalk from 'chalk'
import boxen from 'boxen'
import ora from 'ora'

import { formatDate, getTypeOfInteraction, numberAlign, oneLine, resolveAction, resolveChannel, resolveUser } from '@utils/functions'
import { Scheduler } from '@services'

import { apiConfig, logsConfig } from '@config'

@singleton()
export class Logger {

    constructor(
        @inject(delay(() => Client)) private client: Client,
        @inject(delay(() => Scheduler)) private scheduler: Scheduler
    ) {}

    private readonly logPath: string = `${__dirname.includes('build') ? `${__dirname}/..` : __dirname}/../../logs`
    private readonly levels = ['debug', 'info', 'warn', 'error'] as const
    private spinner = ora()

    /**
     * Most atomic log function, that will either log in console, file or other depending params.
     * @param level debug, info, warn, error
     * @param message message to log
     * @param saveToFile if true, the message will be saved to a file
     * @param channelId Discord channel to log to (if `null`, nothing will be logged to Discord)
     */
    log(
        level: typeof this.levels[number] = 'info', 
        message: string = '', 
        saveToFile: boolean = true,
        channelId: string | null = null
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

        // send to discord channel
        if (channelId) {

            const client = container.resolve(Client)
            const channel = client.channels.cache.get(channelId)

            if (
                channel instanceof TextChannel 
                || channel instanceof ThreadChannel
            ) {

                channel.send(message)
            }
        }
    }

    /**
     * Logs any interaction that is not excluded in the config.
     * @param interaction 
     */
    logInteraction(interaction: AllInteractions) {

        if (logsConfig.interaction.console) {

            const type = constant(getTypeOfInteraction(interaction))
            if (logsConfig.interaction.exclude.includes(type)) return
            
            const action = resolveAction(interaction)
            const channel = resolveChannel(interaction)
            const user = resolveUser(interaction)

            const message = `(${type}) "${action}" ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in #${channel.name}`: ''}${user ? ` by ${user.username}#${user.discriminator}`: ''}`
    
            this.log(
                'info', 
                message, 
                logsConfig.interaction.file,
                logsConfig.interaction.channel
            )
        }
    }

    /**
     * Logs any simple message command that is not excluded in the config.
     * @param command 
     */
    logSimpleCommand(command: SimpleCommandMessage) {

        if (logsConfig.simpleCommand.console) {

            const type = 'SIMPLE_COMMAND_MESSAGE'
            const action = resolveAction(command)
            const channel = resolveChannel(command)
            const user = resolveUser(command)

            const message = `(${type}) "${action}" ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in ${channel.name}`: ''}${user ? ` by ${user.username}#${user.discriminator}`: ''}`
    
            this.log(
                'info', 
                message, 
                logsConfig.interaction.file,
                logsConfig.interaction.channel
            )
        }
    }

    /**
     * Logs all new users.
     * @param user 
     */
    logNewUser(user: User) {

        if (logsConfig.newUser.console) {

            this.log(
                'info',
                `(NEW_USER) ${user.username}#${user.discriminator} (${user.id}) has been added to the db`,
                logsConfig.newUser.file,
                logsConfig.newUser.channel
            )
        }
    }

    /**
     * Logs all 'actions' (create, delete, etc) of a guild.
     * @param type NEW_GUILD, DELETE_GUILD, RECOVER_GUILD
     * @param guildId 
     */
    logGuild(type: 'NEW_GUILD' | 'DELETE_GUILD' | 'RECOVER_GUILD', guildId: string) {

        if (logsConfig.guild.console) {

            const additionalMessage = 
                type === 'NEW_GUILD' ? 'has been added to the db' : 
                type === 'DELETE_GUILD' ? 'has been deleted' : 
                type === 'RECOVER_GUILD' ? 'has been recovered' : ''

            this.log(
                'info',
                `(${type}) ${guildId} ${additionalMessage}`,
                logsConfig.guild.file,
                logsConfig.guild.channel
            )
        }
    }

    startSpinner(text: string) {

        this.spinner.start(text)
    }

    logStartingConsole() {

        const symbol = '✓',
              tab = '\u200B  \u200B'

        this.spinner.stop()

        console.log(chalk.dim.gray('\n━━━━━━━━━━ Started! ━━━━━━━━━━\n'))

        // commands
        const slashCommands = MetadataStorage.instance.applicationCommandSlashes
        const simpleCommands = MetadataStorage.instance.simpleCommands
        const contextMenus = [
            ...MetadataStorage.instance.applicationCommandMessages,
            ...MetadataStorage.instance.applicationCommandUsers
        ]
        const commandsSum = slashCommands.length + simpleCommands.length + contextMenus.length

        console.log(chalk.blue(`${symbol} ${numberAlign(commandsSum)} ${chalk.bold('commands')} loaded`))
        console.log(chalk.dim.gray(oneLine`
            ${tab}┝──╾ ${numberAlign(slashCommands.length)} slash commands\N
            ${tab}┝──╾ ${numberAlign(simpleCommands.length)} simple commands\N
            ${tab}╰──╾ ${numberAlign(contextMenus.length)} context menus
        `))

        // events
        const events = MetadataStorage.instance.events

        console.log(chalk.magenta(`${symbol} ${numberAlign(events.length)} ${chalk.bold('events')} loaded`))

        // entities
        const entities = fs.readdirSync('./src/entities')
            .filter(entity => 
                !entity.startsWith('index')
                && !entity.startsWith('BaseEntity')
            )
            .map(entity => entity.split('.')[0])

        console.log(chalk.red(`${symbol} ${numberAlign(entities.length)} ${chalk.bold('entities')} loaded`))

        // services
        const services = fs.readdirSync('./src/services')
            .filter(service => !service.startsWith('index'))
            .map(service => service.split('.')[0])
        
        console.log(chalk.yellow(`${symbol} ${numberAlign(services.length)} ${chalk.bold('services')} loaded`))

        // api
        const endpoints = KoaMetadataStorage.instance.routes

        console.log(chalk.cyan(`${symbol} ${numberAlign(endpoints.length)} ${chalk.bold('api endpoints')} loaded`))
    
        // scheduled jobs
        const scheduledJobs = this.scheduler.jobs.size

        console.log(chalk.green(`${symbol} ${numberAlign(scheduledJobs)} ${chalk.bold('scheduled jobs')} loaded`))
    
        // connected

        console.log(chalk.gray(boxen(
            ` API Server listening on port ${chalk.bold(apiConfig.port)} `,
            {
                padding: 0,
                margin: 1,
                borderStyle: 'round',
                dimBorder: true
            }
        )))

        console.log(chalk.hex('7289DA')(boxen(
            ` ${this.client.user ? `${chalk.bold(this.client.user.tag)}` : 'Bot'} is ${chalk.green('connected')}! `,
            {
                padding: 0,
                margin: {
                    top: 0,
                    bottom: 1,
                    left: 1 * 3,
                    right: 1 * 3
                },
                borderStyle: 'round',
                dimBorder: true
            }
        )))
    
    }
}