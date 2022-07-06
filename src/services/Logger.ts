import { Guild, TextChannel, ThreadChannel, User } from 'discord.js'
import { Client, MetadataStorage, SimpleCommandMessage } from 'discordx'
import { MetadataStorage as KoaMetadataStorage } from '@discordx/koa'
import { container, delay, inject, singleton } from 'tsyringe'
import { constant } from 'case'
import fs from 'fs'
import chalk from 'chalk'
import boxen from 'boxen'
import ora from 'ora'

import { formatDate, getTypeOfInteraction, numberAlign, oneLine, resolveAction, resolveChannel, resolveGuild, resolveUser, validString } from '@utils/functions'
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

    // =================================
    // ======== Output Providers =======
    // =================================

    console(level: typeof this.levels[number] = 'info', message: string = '') {

        this.spinner.stop()

        if (!validString(message)) return

        let templatedMessage = `${level} [${chalk.dim.gray(formatDate(new Date()))}] ${message}`
        if (level === 'error') templatedMessage = chalk.red(templatedMessage)
        
        console[level](templatedMessage)
    }

    file(level: typeof this.levels[number] = 'info', message: string = '') {

        if (!validString(message)) return

        const templatedMessage = `[${formatDate(new Date())}] ${message}`

        const fileName = `${this.logPath}/${level}.log`

        // create the folder if it doesn't exist
        if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath)
        // create file if it doesn't exist
        if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, '')

        fs.appendFileSync(fileName, `${templatedMessage}\n`)
    }

    discordChannel(channelId: string, message: string = '', level?: typeof this.levels[number]) {

        const client = container.resolve(Client)
        const channel = client.channels.cache.get(channelId)

        if (
            channel instanceof TextChannel 
            || channel instanceof ThreadChannel
        ) {

            // TODO: add support for embeds depending on the level
            channel.send(message)
        }
    }

    // =================================
    // =========== Shortcut ============
    // =================================

    /**
     * Shortcut function that will log in console, and optionnaly in file or discord channel depending params.
     * @param level debug, info, warn, error
     * @param message message to log
     * @param saveToFile if true, the message will be saved to a file
     * @param channelId Discord channel to log to (if `null`, nothing will be logged to Discord)
     */
    log(
        level: typeof this.levels[number] = 'info', 
        message: string, 
        saveToFile: boolean = true,
        channelId: string | null = null
    ) {

        if (message === '') return
        
        // log in the console
        this.console(level, message)
        
        // save log to file
        if (saveToFile) this.file(level, message)

        // send to discord channel
        if (channelId) this.discordChannel(channelId, message, level)
    }

    // =================================
    // ========= Log Templates =========
    // =================================

    /**
     * Logs any interaction that is not excluded in the config.
     * @param interaction 
     */
    logInteraction(interaction: AllInteractions) {

        const type = constant(getTypeOfInteraction(interaction)) as InteractionsConstants
        if (logsConfig.interaction.exclude.includes(type)) return

        const action = resolveAction(interaction)
        const channel = resolveChannel(interaction)
        const guild = resolveGuild(interaction)
        const user = resolveUser(interaction)

        const message = oneLine`
            (${type})
            "${action}"
            ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in channel #${channel.name}`: ''}
            ${guild ? `in guild ${guild.name}`: ''}
            ${user ? `by ${user.username}#${user.discriminator}`: ''}
        `

        const chalkedMessage = oneLine`
            (${chalk.bold.white(type)})
            "${chalk.bold.green(action)}"
            ${channel instanceof TextChannel || channel instanceof ThreadChannel ? 
                `${chalk.dim.italic.gray('in channel')} ${chalk.bold.blue(`#${channel.name}`)}`
                : ''
            }
            ${guild ? 
                `${chalk.dim.italic.gray('in guild')} ${chalk.bold.blue(`${guild.name}`)}`
                : ''
            }
            ${user ? 
                `${chalk.dim.italic.gray('by')} ${chalk.bold.blue(`${user.username}#${user.discriminator}`)}`
                : ''
            }
        `

        if (logsConfig.interaction.console) this.console('info', chalkedMessage)
        if (logsConfig.interaction.file) this.file('info', message)
        if (logsConfig.interaction.channel) this.discordChannel(logsConfig.interaction.channel, message, 'info')
    }

    /**
     * Logs all new users.
     * @param user 
     */
    logNewUser(user: User) {

        const message = `(NEW_USER) ${user.tag} (${user.id}) has been added to the db`
        const chalkedMessage = `(${chalk.bold.white('NEW_USER')}) ${chalk.bold.green(user.tag)} (${chalk.bold.blue(user.id)}) ${chalk.dim.italic.gray('has been added to the db')}`

        if (logsConfig.newUser.console) this.console('info', chalkedMessage)
        if (logsConfig.newUser.file) this.file('info', message)
        if (logsConfig.newUser.channel) this.discordChannel(logsConfig.newUser.channel, message, 'info')
    }

    /**
     * Logs all 'actions' (create, delete, etc) of a guild.
     * @param type NEW_GUILD, DELETE_GUILD, RECOVER_GUILD
     * @param guildId 
     */
    logGuild(type: 'NEW_GUILD' | 'DELETE_GUILD' | 'RECOVER_GUILD', guildId: string) {

        const additionalMessage = 
            type === 'NEW_GUILD' ? 'has been added to the db' : 
            type === 'DELETE_GUILD' ? 'has been deleted' : 
            type === 'RECOVER_GUILD' ? 'has been recovered' : ''
        
        const guild = container.resolve(Client).guilds.cache.get(guildId)

        const message = `(${type}) Guild ${guild ? `${guild.name} (${guildId})` : guildId} ${additionalMessage}`
        const chalkedMessage = oneLine`
            (${chalk.bold.white(type)})
            ${chalk.dim.italic.gray('Guild')}
            ${guild ? 
                `${chalk.bold.green(guild.name)} (${chalk.bold.blue(guildId)})`
                : guildId
            }
            ${chalk.dim.italic.gray(additionalMessage)}
        `

        if (logsConfig.guild.console) this.console('info', chalkedMessage)
        if (logsConfig.guild.file) this.file('info', message)
        if (logsConfig.guild.channel) this.discordChannel(logsConfig.guild.channel, message, 'info')
    }

    // =================================
    // ============= Other =============
    // =================================

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
            ${tab}┝──╾ ${numberAlign(slashCommands.length)} slash commands\NEWLINE
            ${tab}┝──╾ ${numberAlign(simpleCommands.length)} simple commands\NEWLINE
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