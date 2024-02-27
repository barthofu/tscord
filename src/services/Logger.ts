import fs from 'node:fs'
import { unlink } from 'node:fs/promises'
import path from 'node:path'

import archiver from 'archiver'
import boxen from 'boxen'
import { constant } from 'case'
import chalk from 'chalk'
import dayjs from 'dayjs'
import { BaseMessageOptions, TextChannel, ThreadChannel, User } from 'discord.js'
import { Client, MetadataStorage } from 'discordx'
import ora from 'ora'
import { parse, StackFrame } from 'stacktrace-parser'
import { delay, inject } from 'tsyringe'

import * as controllers from '@/api/controllers'
import { apiConfig, logsConfig } from '@/configs'
import { Schedule, Service } from '@/decorators'
import { env } from '@/env'
import { locales } from '@/i18n'
import { Pastebin, PluginsManager, Scheduler, Store } from '@/services'
import { fileOrDirectoryExists, formatDate, getTypeOfInteraction, numberAlign, oneLine, resolveAction, resolveChannel, resolveDependency, resolveGuild, resolveUser, validString } from '@/utils/functions'

const defaultConsole = { ...console }

@Service()
export class Logger {

	private readonly logPath: string = path.join(__dirname, '..', '..', 'logs')
	private readonly logArchivePath: string = path.join(this.logPath, 'archives')

	private readonly levels = ['info', 'warn', 'error'] as const
	private embedLevelBuilder = {
		info: (message: string): BaseMessageOptions => ({ embeds: [{ title: 'INFO', description: message, color: 0x007FE7, timestamp: new Date().toISOString() }] }),
		warn: (message: string): BaseMessageOptions => ({ embeds: [{ title: 'WARN', description: message, color: 0xF37100, timestamp: new Date().toISOString() }] }),
		error: (message: string): BaseMessageOptions => ({ embeds: [{ title: 'ERROR', description: message, color: 0x7C1715, timestamp: new Date().toISOString() }] }),
	}

	private interactionTypeReadable: { [key in InteractionsConstants]: string } = {
		CHAT_INPUT_COMMAND_INTERACTION: 'Slash command',
		SIMPLE_COMMAND_MESSAGE: 'Simple command',
		CONTEXT_MENU_INTERACTION: 'Context menu',
		BUTTON_INTERACTION: 'Button',
		SELECT_MENU_INTERACTION: 'Select menu',
		MODAL_SUBMIT_INTERACTION: 'Modal submit',
	}

	private spinner = ora()

	private lastLogsTail: string[] = []

	constructor(
        @inject(delay(() => Client)) private client: Client,
        @inject(delay(() => Scheduler)) private scheduler: Scheduler,
        @inject(delay(() => Store)) private store: Store,
        @inject(delay(() => Pastebin)) private pastebin: Pastebin,
        @inject(delay(() => PluginsManager)) private pluginsManager: PluginsManager
	) {
		if (!this.store.get('botHasBeenReloaded')) {
			console.info = (...args) => this.baseLog('info', ...args)
			console.warn = (...args) => this.baseLog('warn', ...args)
			console.error = (...args) => this.baseLog('error', ...args)
		}
	}

	// =================================
	// ======= Base log function =======
	// =================================

	private baseLog(level: typeof this.levels[number], ...args: string[]) {
		const excludedPatterns = [
			'[typesafe-i18n]',
		]

		const message = args.join(', ')

		if (!excludedPatterns.some(pattern => message.includes(pattern))) {
			this.log(message, level)
		}
	}

	// =================================
	// ======== Output Providers =======
	// =================================

	/**
	 * Log a message in the console.
	 * @param message the message to log
	 * @param level info (default) | warn | error
	 * @param ignoreTemplate if it should ignore the timestamp template (default to false)
	 */
	console(message: string, level: typeof this.levels[number] = 'info', ignoreTemplate = false) {
		if (this.spinner.isSpinning)
			this.spinner.stop()

		if (!validString(message))
			return

		let templatedMessage = ignoreTemplate ? message : `${level} [${chalk.dim.gray(formatDate(new Date()))}] ${message}`
		if (level === 'error')
			templatedMessage = chalk.red(templatedMessage)

		defaultConsole[level](templatedMessage)

		// save the last logs tail queue
		if (this.lastLogsTail.length >= logsConfig.logTailMaxSize)
			this.lastLogsTail.shift()

		this.lastLogsTail.push(message)
	}

	/**
	 * Log a message in a log file.
	 * @param message the message to log
	 * @param level info (default) | warn | error
	 */
	file(message: string, level: typeof this.levels[number] = 'info') {
		if (!validString(message))
			return

		const templatedMessage = `[${formatDate(new Date())}] ${message}`

		const fileName = `${this.logPath}/${level}.log`

		// create the folder if it doesn't exist
		if (!fileOrDirectoryExists(this.logPath))
			fs.mkdirSync(this.logPath)

		// create file if it doesn't exist
		if (!fileOrDirectoryExists(fileName))
			fs.writeFileSync(fileName, '')

		fs.appendFileSync(fileName, `${templatedMessage}\n`)
	}

	/**
	 * Log a message in a Discord channel using embeds.
	 * @param channelId the ID of the discord channel to log to
	 * @param message the message to log or a [MessageOptions](https://discord.js.org/#/docs/discord.js/main/typedef/BaseMessageOptions) compliant object (like embeds, components, etc)
	 * @param level info (default) | warn | error
	 */
	async discordChannel(channelId: string, message: string | BaseMessageOptions, level?: typeof this.levels[number]) {
		if (!this.client.token)
			return

		const channel = await this.client.channels.fetch(channelId).catch(() => null)

		if (
			channel
			&& (channel instanceof TextChannel
			|| channel instanceof ThreadChannel)
		) {
			if (typeof message !== 'string')
				return channel.send(message).catch(console.error)

			channel.send(this.embedLevelBuilder[level ?? 'info'](message)).catch(console.error)
		}
	}

	// =================================
	// =========== Archive =============
	// =================================

	/**
	 * Archive the logs in a zip file each day.
	 */
	@Schedule('0 0 * * *')
	async archiveLogs() {
		if (!logsConfig.archive.enabled)
			return

		const date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
		const currentLogsPaths = fs.readdirSync(this.logPath).filter(file => file.endsWith('.log'))
		const output = fs.createWriteStream(`${this.logArchivePath}/logs-${date}.tar.gz`)

		if (!fileOrDirectoryExists(this.logArchivePath))
			fs.mkdirSync(this.logArchivePath)

		const archive = archiver('tar', {
			gzip: true,
			gzipOptions: {
				level: 9, // maximum compression
			},
		})

		archive.pipe(output)

		// add files to the archive
		for (const logPath of currentLogsPaths)
			archive.file(`${this.logPath}/${logPath}`, { name: logPath })

		// create archive
		await archive.finalize()

		// delete old logs
		await this.deleteCurrentLogs()

		// retention policy
		await this.deleteOldLogArchives()
	}

	private async deleteCurrentLogs() {
		const currentLogsPaths = fs.readdirSync(this.logPath).filter(file => file.endsWith('.log'))

		for (const logPath of currentLogsPaths) {
			// empty the file
			fs.writeFileSync(`${this.logPath}/${logPath}`, '')
		}
	}

	private async deleteOldLogArchives() {
		const archives = fs.readdirSync(this.logArchivePath).filter(file => file.endsWith('.tar.gz'))

		for (const archive of archives) {
			const date = dayjs(archive.split('logs-')[1].split('.tar.gz')[0])
			console.log(date.format('YYYY-MM-DD'))
			if (date.isBefore(dayjs().subtract(logsConfig.archive.retention, 'day')))
				await unlink(`${this.logArchivePath}/${archive}`)
		}
	}

	// =================================
	// =========== Shortcut ============
	// =================================

	/**
	 * Shortcut function that will log in the console, and optionally in a file or discord channel depending on params.
	 * @param message message to log
	 * @param level info (default) | warn | error
	 * @param saveToFile if true, the message will be saved to a file (default to true)
	 * @param channelId Discord channel to log to (if `null`, nothing will be logged to Discord)
	 */
	log(
		message: string,
        level: typeof this.levels[number] = 'info',
        saveToFile: boolean = true,
        channelId: string | null = null
	) {
		if (message === '')
			return

		// log in the console
		this.console(message, level)

		// save log to file
		if (saveToFile)
			this.file(message, level)

		// send to discord channel
		if (channelId)
			this.discordChannel(channelId, message, level)
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
		if (logsConfig.interaction.exclude.includes(type))
			return

		const action = resolveAction(interaction)
		const channel = resolveChannel(interaction)
		const guild = resolveGuild(interaction)
		const user = resolveUser(interaction)

		const message = oneLine`
            (${type})
            "${action}"
            ${channel instanceof TextChannel || channel instanceof ThreadChannel ? `in channel #${channel.name}` : ''}
            ${guild ? `in guild ${guild.name}` : ''}
            ${user ? `by ${user.username}#${user.discriminator}` : ''}
        `

		const chalkedMessage = oneLine`
            (${chalk.bold.white(type)})
            "${chalk.bold.green(action)}"
            ${channel instanceof TextChannel || channel instanceof ThreadChannel
                ? `${chalk.dim.italic.gray('in channel')} ${chalk.bold.blue(`#${channel.name}`)}`
                : ''
            }
            ${guild
                ? `${chalk.dim.italic.gray('in guild')} ${chalk.bold.blue(`${guild.name}`)}`
                : ''
            }
            ${user
                ? `${chalk.dim.italic.gray('by')} ${chalk.bold.blue(`${user.username}#${user.discriminator}`)}`
                : ''
            }
        `

		if (logsConfig.interaction.console)
			this.console(chalkedMessage)
		if (logsConfig.interaction.file)
			this.file(message)
		if (logsConfig.interaction.channel) {
			this.discordChannel(logsConfig.interaction.channel, {
				embeds: [{
					author: {
						name: (user ? `${user.username}#${user.discriminator}` : 'Unknown user'),
						icon_url: (user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : ''),
					},
					title: `Interaction`,
					thumbnail: {
						url: guild?.iconURL({ forceStatic: true }) ?? '',
					},
					fields: [
						{
							name: 'Type',
							value: this.interactionTypeReadable[type],
							inline: true,
						},
						{
							name: '\u200B',
							value: '\u200B',
							inline: true,
						},
						{
							name: 'Action',
							value: action,
							inline: true,
						},
						{
							name: 'Guild',
							value: guild ? guild.name : 'Unknown',
							inline: true,
						},
						{
							name: '\u200B',
							value: '\u200B',
							inline: true,
						},
						{
							name: 'Channel',
							value: channel instanceof TextChannel || channel instanceof ThreadChannel ? `#${channel.name}` : 'Unknown',
							inline: true,
						},
					],
					color: 0xDB5C21,
					timestamp: new Date().toISOString(),
				}],
			})
		}
	}

	/**
	 * Logs all new users.
	 * @param user
	 */
	logNewUser(user: User) {
		const message = `(NEW_USER) ${user.tag} (${user.id}) has been added to the db`
		const chalkedMessage = `(${chalk.bold.white('NEW_USER')}) ${chalk.bold.green(user.tag)} (${chalk.bold.blue(user.id)}) ${chalk.dim.italic.gray('has been added to the db')}`

		if (logsConfig.newUser.console)
			this.console(chalkedMessage)
		if (logsConfig.newUser.file)
			this.file(message)
		if (logsConfig.newUser.channel) {
			this.discordChannel(logsConfig.newUser.channel, {
				embeds: [{
					title: 'New user',
					description: `**${user.tag}**`,
					thumbnail: {
						url: user.displayAvatarURL({ forceStatic: false }),
					},
					color: 0x83DD80,
					timestamp: new Date().toISOString(),
					footer: {
						text: user.id,
					},
				}],
			})
		}
	}

	/**
	 * Logs all 'actions' (create, delete, etc) of a guild.
	 * @param type NEW_GUILD, DELETE_GUILD, RECOVER_GUILD
	 * @param guildId
	 */
	logGuild(type: 'NEW_GUILD' | 'DELETE_GUILD' | 'RECOVER_GUILD', guildId: string) {
		const additionalMessage
			= type === 'NEW_GUILD'
				? 'has been added to the db'
				: type === 'DELETE_GUILD'
					? 'has been deleted'
					: type === 'RECOVER_GUILD' ? 'has been recovered' : ''

		resolveDependency(Client).then(async (client) => {
			const guild = await client.guilds.fetch(guildId).catch(() => null)

			const message = `(${type}) Guild ${guild ? `${guild.name} (${guildId})` : guildId} ${additionalMessage}`
			const chalkedMessage = oneLine`
                (${chalk.bold.white(type)})
                ${chalk.dim.italic.gray('Guild')}
                ${guild
                    ? `${chalk.bold.green(guild.name)} (${chalk.bold.blue(guildId)})`
                    : guildId
                }
                ${chalk.dim.italic.gray(additionalMessage)}
            `

			if (logsConfig.guild.console)
				this.console(chalkedMessage)
			if (logsConfig.guild.file)
				this.file(message)
			if (logsConfig.guild.channel) {
				this.discordChannel(logsConfig.guild.channel, {
					embeds: [{
						title: (type === 'NEW_GUILD' ? 'New guild' : type === 'DELETE_GUILD' ? 'Deleted guild' : 'Recovered guild'),

						// description: `**${guild.name} (\`${guild.id}\`)**\n${guild.memberCount} members`,
						fields: [{
							name: guild?.name ?? 'Unknown',
							value: `${guild?.memberCount ?? 'N/A'} members`,
						}],
						footer: {
							text: guild?.id ?? 'Unknown',
						},
						thumbnail: {
							url: guild?.iconURL() ?? '',
						},
						color: (type === 'NEW_GUILD' ? 0x02FD77 : type === 'DELETE_GUILD' ? 0xFF0000 : 0xFFFB00),
						timestamp: new Date().toISOString(),
					}],
				})
			}
		})
	}

	/**
	 * Logs errors.
	 * @param error
	 * @param type uncaughtException, unhandledRejection
	 * @param trace
	 */
	async logError(error: Error | any, type: 'Exception' | 'unhandledRejection', trace: StackFrame[] = parse(error.stack ?? '')) {
		let message = '(ERROR)'
		let embedMessage = ''
		let embedTitle = ''
		let chalkedMessage = `(${chalk.bold.white('ERROR')})`

		if (trace && trace[0]) {
			message += ` ${type === 'Exception' ? 'Exception' : 'Unhandled rejection'} : ${error.message}\n${trace.map((frame: StackFrame) => `\t> ${frame.file}:${frame.lineNumber}`).join('\n')}`
			embedMessage += `\`\`\`\n${trace.map((frame: StackFrame) => `\> ${frame.file}:${frame.lineNumber}`).join('\n')}\n\`\`\``
			embedTitle += `***${type === 'Exception' ? 'Exception' : 'Unhandled rejection'}* : ${error.message}**`
			chalkedMessage += ` ${chalk.dim.italic.gray(type === 'Exception' ? 'Exception' : 'Unhandled rejection')} : ${error.message}\n${chalk.dim.italic(trace.map((frame: StackFrame) => `\t> ${frame.file}:${frame.lineNumber}`).join('\n'))}`
		} else {
			if (type === 'Exception') {
				message += `An exception as occurred in a unknown file\n\t> ${error.message}`
				embedMessage += `An exception as occurred in a unknown file\n${error.message}`
			} else {
				message += `An unhandled rejection as occurred in a unknown file\n\t> ${error}`
				embedMessage += `An unhandled rejection as occurred in a unknown file\n${error}`
			}
		}

		if (embedMessage.length >= 4096) {
			const paste = await this.pastebin.createPaste(`${embedTitle}\n${embedMessage}`)
			console.log(paste?.getLink())
			embedMessage = `[Pastebin of the error](https://rentry.co/${paste?.getLink()})`
		}

		if (logsConfig.error.console)
			this.console(chalkedMessage, 'error')
		if (logsConfig.error.file)
			this.file(message, 'error')
		if (logsConfig.error.channel && env.NODE_ENV === 'production') {
			this.discordChannel(logsConfig.error.channel, {
				embeds: [{
					title: (embedTitle.length >= 256 ? (`${embedTitle.substring(0, 252)}...`) : embedTitle),
					description: embedMessage,
					color: 0x7C1715,
					timestamp: new Date().toISOString(),

				}],
			}, 'error')
		}
	}

	// =================================
	// ============= Other =============
	// =================================

	getLastLogs() {
		return this.lastLogsTail
	}

	startSpinner(text: string) {
		this.spinner.start(text)
	}

	async logStartingConsole() {
		const symbol = '✓'
		const tab = '\u200B  \u200B'

		this.spinner.stop()

		this.console(chalk.dim.gray('\n━━━━━━━━━━ Started! ━━━━━━━━━━\n'), 'info', true)

		// commands
		const slashCommands = MetadataStorage.instance.applicationCommandSlashes
		const simpleCommands = MetadataStorage.instance.simpleCommands
		const contextMenus = [
			...MetadataStorage.instance.applicationCommandMessages,
			...MetadataStorage.instance.applicationCommandUsers,
		]
		const commandsSum = slashCommands.length + simpleCommands.length + contextMenus.length

		this.console(chalk.blue(`${symbol} ${numberAlign(commandsSum)} ${chalk.bold('commands')} loaded`), 'info', true)
		this.console(chalk.dim.gray(`${tab}┝──╾ ${numberAlign(slashCommands.length)} slash commands\n${tab}┝──╾ ${numberAlign(simpleCommands.length)} simple commands\n${tab}╰──╾ ${numberAlign(contextMenus.length)} context menus`), 'info', true)

		// events
		const events = MetadataStorage.instance.events

		this.console(chalk.yellowBright(`${symbol} ${numberAlign(events.length)} ${chalk.bold('events')} loaded`), 'info', true)

		// entities
		const entities = fs.readdirSync(path.join(__dirname, '..', 'entities'))
			.filter(entity =>
				!entity.startsWith('index')
				&& !entity.startsWith('BaseEntity')
			)

		const pluginsEntitesCount = this.pluginsManager.plugins.reduce((acc, plugin) => acc + Object.values(plugin.entities).length, 0)

		this.console(chalk.red(`${symbol} ${numberAlign(entities.length + pluginsEntitesCount)} ${chalk.bold('entities')} loaded`), 'info', true)

		// services
		const services = fs.readdirSync(path.join(__dirname, '..', 'services'))
			.filter(service => !service.startsWith('index'))

		const pluginsServicesCount = this.pluginsManager.plugins.reduce((acc, plugin) => acc + Object.values(plugin.services).length, 0)

		this.console(chalk.hex('ffc107')(`${symbol} ${numberAlign(services.length + pluginsServicesCount)} ${chalk.bold('services')} loaded`), 'info', true)

		// api
		if (apiConfig.enabled) {
			const endpointsCount = Object.values(controllers).reduce((acc, controller) => {
				const methodsName = Object
					.getOwnPropertyNames(controller.prototype)
					.filter(methodName => methodName !== 'constructor')

				return acc + methodsName.length
			}, 0)

			this.console(chalk.cyan(`${symbol} ${numberAlign(endpointsCount)} ${chalk.bold('api endpoints')} loaded`), 'info', true)
		}

		// scheduled jobs
		const scheduledJobs = this.scheduler.jobs.size
		this.console(chalk.green(`${symbol} ${numberAlign(scheduledJobs)} ${chalk.bold('scheduled jobs')} loaded`), 'info', true)

		// translations
		this.console(chalk.hex('ab47bc')(`${symbol} ${numberAlign(locales.length)} ${chalk.bold('translations')} loaded`), 'info', true)

		// plugins
		const pluginsCount = this.pluginsManager.plugins.length

		this.console(chalk.hex('#47d188')(`${symbol} ${numberAlign(pluginsCount)} ${chalk.bold(`plugin${pluginsCount > 1 ? 's' : ''}`)} loaded`), 'info', true)

		// connected
		if (apiConfig.enabled) {
			this.console(chalk.gray(boxen(
				` API Server listening on port ${chalk.bold(apiConfig.port)} `,
				{
					padding: 0,
					margin: {
						top: 1,
						bottom: 0,
						left: 1,
						right: 1,
					},
					borderStyle: 'round',
					dimBorder: true,
				}
			)), 'info', true)
		}

		this.console(chalk.hex('7289DA')(boxen(
			` ${this.client.user ? `${chalk.bold(this.client.user.tag)}` : 'Bot'} is ${chalk.green('connected')}! `,
			{
				padding: 0,
				margin: {
					top: 1,
					bottom: 1,
					left: 1 * 3,
					right: 1 * 3,
				},
				borderStyle: 'round',
				dimBorder: true,
			}
		)), 'info', true)
	}

}
