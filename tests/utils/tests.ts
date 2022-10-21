import { jest, expect } from "@jest/globals"
import { Client } from "discordx"
import { RawCommandInteractionData } from "discord.js/typings/rawDataTypes"

import { L } from "../../src/i18n"
import { Mock } from "./Mock"
import { Interaction } from "discord.js"

export const mockInteractionAndSpyReply = <T extends RawCommandInteractionData['data']>(commandData: T) => {

    const mock = new Mock()
    const interaction = mock.mockCommandInteraction(commandData)
    
    const spy = jest.spyOn(interaction, 'followUp') 

    return { interaction, spy }
}
  
export const executeCommandAndSpyReply = async (commandRun: any, content: any) => {

    const { interaction, spy } = await mockInteractionAndSpyReply(content)

    await commandRun(
        interaction as Interaction,
        interaction.client,
        { 
            localize: L['en'], 
            sanitizedLocale: 'en'
        }
    )

    return spy
}

export const embedContaining = (content: any) => {

    return {
        embeds: expect.arrayContaining([expect.objectContaining(content)])
    }
}