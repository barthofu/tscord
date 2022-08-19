import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import type { CommandInteraction, Message } from "discord.js"
import oneLine from 'oneline'

import { Slash, Discord } from "@decorators"

@Discord()
@Category('General')
export default class PingCommand {

	@Slash({ 
		name: 'ping',
		description: 'Pong!'
	})
	async ping(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		
		const msg = (await interaction.followUp({ content: "Pinging...", fetchReply: true })) as Message

        const content = oneLine`
          ${msg.inGuild() ? `${interaction.member},` : ""}
          Pong! The message round-trip took
          ${msg.createdTimestamp - interaction.createdTimestamp}ms.
          ${client.ws.ping ? `The heartbeat ping is ${Math.round(client.ws.ping)}ms.` : ""}
        `

        await msg.edit(content)
	}

}
