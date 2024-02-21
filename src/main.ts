import 'dotenv/config'
import 'reflect-metadata'

import path from 'node:path'
import process from 'node:process'

import { importx } from '@discordx/importer'
import { RequestContext } from '@mikro-orm/core'
import discordLogs from 'discord-logs'
import { Client, DIService, tsyringeDependencyRegistryEngine } from 'discordx'
import { container } from 'tsyringe'

import { Server } from '@/api/server'
import { apiConfig, generalConfig } from '@/configs'
import { NoBotTokenError } from '@/errors'
import { Database, ErrorHandler, EventManager, ImagesUpload, Logger, PluginsManager, Store } from '@/services'
import { initDataTable, resolveDependency } from '@/utils/functions'

import { clientConfig } from './client'

const importPattern = path.join(__dirname, '{events,commands}', '**', '*.{ts,js}')

async function run() {
	// init logger, plugins manager and error handler
	const logger = await resolveDependency(Logger)

	// init error handler
	await resolveDependency(ErrorHandler)

	// init plugins
	const pluginManager = await resolveDependency(PluginsManager)

	// load plugins and import translations
	await pluginManager.loadPlugins()
	await pluginManager.syncTranslations()

	// start spinner
	console.log('\n')
	logger.startSpinner('Starting...')

	// init the database
	const db = await resolveDependency(Database)
	await db.initialize()

	// init the client
	DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)
	const client = new Client(clientConfig())

	// Load all new events
	discordLogs(client, { debug: false })
	container.registerInstance(Client, client)

	// import all the commands and events
	await importx(importPattern)
	await pluginManager.importCommands()
	await pluginManager.importEvents()

	RequestContext.create(db.orm.em, async () => {
		// init the data table if it doesn't exist
		await initDataTable()

		// init plugins services
		await pluginManager.initServices()

		// init the plugin main file
		await pluginManager.execMains()

		// log in with the bot token
		if (!process.env.BOT_TOKEN) {
			throw new NoBotTokenError()
		}
		client.login(process.env.BOT_TOKEN)
			.then(async () => {
				// start the api server
				if (apiConfig.enabled) {
					const server = await resolveDependency(Server)
					await server.start()
				}

				// upload images to imgur if configured
				if (process.env.IMGUR_CLIENT_ID && generalConfig.automaticUploadImagesToImgur) {
					const imagesUpload = await resolveDependency(ImagesUpload)
					await imagesUpload.syncWithDatabase()
				}

				const store = await container.resolve(Store)
				store.select('ready').subscribe(async (ready) => {
					// check that all properties that are not null are set to true
					if (
						Object
							.values(ready)
							.filter(value => value !== null)
							.every(value => value === true)
					) {
						const eventManager = await resolveDependency(EventManager)
						eventManager.emit('templateReady') // the template is fully ready!
					}
				})
			})
			.catch((err) => {
				console.error(err)
				process.exit(1)
			})
	})
}

run()
