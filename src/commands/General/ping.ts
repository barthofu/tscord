import { Client, SimpleCommand, SimpleCommandMessage } from "discordx"
import { Category } from "@discordx/utilities"
import type { CommandInteraction, Message } from "discord.js"
import oneLine from 'oneline'

import { Slash, Discord, Guard, SlashOption, On } from "@decorators"
import { resolveChannel, resolveGuild, setMaintenance } from "@utils/functions"
import { Match } from "@guards"

@Discord()
@Category('General')
export default class PingCommand {

	@Slash('ping', { description: 
		'Pong!'
	})
	async ping(
		interaction: CommandInteraction,
		client: Client
	) {
		
		const msg = (await interaction.reply({ content: "Pinging...", fetchReply: true })) as Message

        const content = oneLine`
          ${msg.inGuild() ? `${interaction.member},` : ""}
          Pong! The message round-trip took
          ${msg.createdTimestamp - interaction.createdTimestamp}ms.
          ${client.ws.ping ? `The heartbeat ping is ${Math.round(client.ws.ping)}ms.` : ""}
        `

        await msg.edit(content)
	}

}
