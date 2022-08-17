import { Client } from "discordx"
import { Category } from "@discordx/utilities"
import type { CommandInteraction, Message } from "discord.js"

import { Slash, Discord } from "@decorators"
import { L } from "@i18n"

@Discord()
@Category('General')
export default class PingCommand {

	@Slash({ 
		name: 'ping',
		description: 'Pong!',
		descriptionLocalizations: {
			...Object.fromEntries(Object.entries(L).map(([lang, local]) => [lang, local.COMMANDS.PING.DESCRIPTION()]))
		}
	})
	async ping(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		
		const msg = (await interaction.followUp({ content: "Pinging...", fetchReply: true })) as Message

		const content = localize["COMMANDS"]["PING"]["MESSAGE"]({
			member: msg.inGuild() ? `${interaction.member},` : "",
			time: msg.createdTimestamp - interaction.createdTimestamp,
			heartbeat: client.ws.ping ? `The heartbeat ping is ${Math.round(client.ws.ping)}ms.` : ""
		});

        await msg.edit(content)
	}

}
