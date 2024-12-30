import 'reflect-metadata'
import 'dotenv/config'

import { ShardingManager } from 'discord.js'
import { container } from 'tsyringe'

import { Server } from '@/api/server'
import { apiConfig, generalConfig } from '@/configs'
import { checkEnvironmentVariables, env } from '@/env'
import { NoBotTokenError } from '@/errors'
import { Database, ErrorHandler, ImagesUpload, Logger, PluginsManager } from '@/services'
import { resolveDependency } from '@/utils/functions'

async function init() {
	const logger = await resolveDependency(Logger)

	// check environment variables
	checkEnvironmentVariables()

	// init error handler
	await resolveDependency(ErrorHandler)

	// init plugins
	const pluginManager = await resolveDependency(PluginsManager)
	await pluginManager.loadPlugins()
	await pluginManager.syncTranslations()

	// strart spinner
	console.log('\n')
	logger.startSpinner('Starting...')

	// init the database
	const db = await resolveDependency(Database)
	await db.initialize()

	// init the shard manager
	if (!env.BOT_TOKEN) throw new NoBotTokenError()
	const manager = new ShardingManager(`src/shard.${env.NODE_ENV === 'production' ? 'js' : 'ts'}`, {
		token: env.BOT_TOKEN,

		...(
			(env.NODE_ENV === 'production')
				? {
						totalShards: 'auto',
					}
				: {
						execArgv: [
							'--require',
							'ts-node/register',
						],
						totalShards: 1,
					}
		),
	})
	container.registerInstance(ShardingManager, manager)

	// Log when a shard is created
	manager.on('shardCreate', (shard) => {
		console.log(`Launched shard ${shard.id}`)

		// print shard output
		shard.process?.stdout?.on('data', (data) => {
			logger.default(data)
		})

		// print shard errors
		shard.process?.stderr?.on('data', (data) => {
			logger.default(data)
		})
	})

	// init all shard
	manager.spawn({
		delay: 10_000, // Wait 10s between spawning each shard
	}).then(() => {
		manager.broadcastEval((client) => {
			console.log('Guild list :')
			client.guilds.cache.forEach((guild) => {
				console.log(`- ${guild.name} (${guild.id})`)
			})
		})
	})

	// start the api server
	if (apiConfig.enabled && false) {
		const server = await resolveDependency(Server)
		await server.start()
	}

	// upload images to imgur if configured
	if (env.IMGUR_CLIENT_ID && generalConfig.automaticUploadImagesToImgur) {
		const imagesUpload = await resolveDependency(ImagesUpload)
		await imagesUpload.syncWithDatabase()
	}
}

init()
