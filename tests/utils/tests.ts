import { expect, jest } from "@jest/globals"
import { Interaction } from "discord.js"
import { RawCommandInteractionData } from "discord.js/typings/rawDataTypes"
import { container } from "tsyringe"

import { L } from "@i18n"
import { Mock } from "@tests/utils/Mock"
import { Client, DApplicationCommand, DDiscord } from "discordx"
import { NotBot } from "@guards"

export const mockInteractionAndSpyReply = <T extends RawCommandInteractionData['data']>(commandData: T) => {

    const mock = container.resolve(Mock)
    const interaction = mock.mockCommandInteraction(commandData)
    
    const spy = jest.spyOn(interaction, 'followUp') 

    return { interaction, spy }
}
  
export const executeCommandAndSpyReply = async (command: DApplicationCommand, content: any) => {

    const { interaction, spy } = await mockInteractionAndSpyReply(content)
    console.log('command', command)

    command.discord = DDiscord.create('mock')
    console.log('[discord]', command)
    
    await command.execute(
        [],
        interaction as Interaction,
        interaction.client
    )

    return spy
}

export const embedContaining = (content: any) => {

    return {
        embeds: expect.arrayContaining([expect.objectContaining(content)])
    }
}