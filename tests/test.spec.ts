import 'reflect-metadata'

import { importx } from '@discordx/importer'
import { beforeAll, describe, expect, it } from "@jest/globals"
import { Client, DIService, MetadataStorage, tsyringeDependencyRegistryEngine } from "discordx"
import { container } from "tsyringe"

import { Database } from "@services"
import { embedContaining, executeCommandAndSpyReply, Mock, mockInteractionAndSpyReply } from "@tests/utils"
import { ChatInputCommandInteraction } from 'discord.js'

describe('Global test', () => {

    beforeAll(async () => {

        const database = container.resolve(Database)
        await database.initialize()

        DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)

        const client = container.resolve(Mock).getClient()
        container.registerInstance(Client, client)
        console.log('[client]', container.resolve(Client))

        console.log(__dirname + "/../src/commands/**/*.{ts,js}")
        await importx(__dirname + "/../src/commands/**/*.{ts,js}")
    })

    it('should test it', async() => {

        const interactionData = { 
            id: '123456789',  
            name: 'test', 
            type: 2, 
            options: [{
                name: 'option',
                type: 3,
                value: 'test'
            }]
        }

        const { interaction } = await mockInteractionAndSpyReply(interactionData)

        const meta = MetadataStorage.instance.applicationCommandSlashes
        const command = meta.find(c => c.name === 'test')

        console.log('[params]', command!.parseParams(interaction))
        console.log('[method]', command!.method)
        
        const spy = await executeCommandAndSpyReply(command!, interactionData)

        expect(spy).toBeCalledWith(embedContaining({ description: 'test' }))
    })
})