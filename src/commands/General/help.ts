import { Category } from "@discordx/utilities"
import { ActionRowBuilder, APISelectMenuOption, CommandInteraction, EmbedBuilder, inlineCode, StringSelectMenuBuilder, StringSelectMenuInteraction  } from "discord.js"
import { Client, MetadataStorage, SelectMenuComponent } from "discordx"

import { Discord, Slash } from "@decorators"
import { chunkArray, getColor, resolveGuild, validString } from "@utils/functions"
import { TranslationFunctions } from "src/i18n/i18n-types"

@Discord()
@Category('General')
export default class HelpCommand {

	private readonly _categories: Map<string, CommandCategory[]> = new Map()

	constructor() {
		this.loadCategories()
	}

	@Slash({ 
		name: 'help'
    })
	async help(
		interaction: CommandInteraction, 
		client: Client, 
		{ localize }: InteractionData
	) {
		
		const embed = await this.getEmbed({ client, interaction, locale: localize })

		let components: any[] = []
		components.push(this.getSelectDropdown("categories", localize).toJSON())

		interaction.followUp({ 
			embeds: [embed],
			components
		})
	}

	@SelectMenuComponent({
		id: 'help-category-selector'
	})
	async selectCategory(interaction: StringSelectMenuInteraction, client: Client, { localize }: InteractionData) {

        const category = interaction.values[0]

        const embed = await this.getEmbed({ client, interaction, category, locale: localize })
		let components: any[] = []
		components.push(this.getSelectDropdown(category, localize).toJSON())

        interaction.update({
            embeds: [embed],
            components
        })
    }


	private async getEmbed({ client, interaction, category = '', pageNumber = 0, locale }: {
		client: Client, 
		interaction: CommandInteraction | StringSelectMenuInteraction ,  
		category?: string,
		pageNumber?: number
		locale: TranslationFunctions
	}): Promise<EmbedBuilder> {

		const commands = this._categories.get(category)
		
		// default embed
		if (!commands) {
			
			const embed = new EmbedBuilder()
				.setAuthor({
					name: interaction.user.username, 
					iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
				})
				.setTitle(locale.COMMANDS.HELP.EMBED.TITLE())
				.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/a/a4/Cute-Ball-Help-icon.png')
				.setColor(getColor('primary'))

			let currentGuild = resolveGuild(interaction)
			let applicationCommands = [
				...(currentGuild ? (await currentGuild.commands.fetch()).values() : []),
				...(await client.application!.commands.fetch()).values()
			]
			
			for (const category of this._categories) {
				
				let commands = category[1]
					.map(cmd => {
						return "</" +
								(cmd.group ? cmd.group + ' ' : '') +
								(cmd.subgroup ? cmd.subgroup + ' ' : '') +
								cmd.name +
								":" +
								applicationCommands.find(acmd => acmd.name == (cmd.group ? cmd.group : cmd.name))!.id +
								">"	
					})
					
				embed.addFields([{
					name: category[0],
					value: commands.join(', ')
				}])
			}

			return embed
		}

		// specific embed
		const chunks = chunkArray(commands, 24),
			  maxPage = chunks.length,
			  resultsOfPage = chunks[pageNumber]

		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
			})
			.setTitle(locale.COMMANDS.HELP.EMBED.CATEGORY_TITLE({category}))
			.setFooter({
				text: `${client.user!.username} • Page ${pageNumber + 1} of ${maxPage}`
			})
		
		if (!resultsOfPage) return embed

		for (const item of resultsOfPage) {

			let currentGuild = resolveGuild(interaction)
			let applicationCommands = [
				...(currentGuild ? (await currentGuild.commands.fetch()).values() : []),
				...(await client.application!.commands.fetch()).values()
			]

			const { description } = item
			const fieldValue = validString(description) ? description : "No description"
			const name = 	"</" +
							(item.group ? item.group + ' ' : '') +
							(item.subgroup ? item.subgroup + ' ' : '') +
							item.name +
							":" +
							applicationCommands.find(acmd => acmd.name == (item.group ? item.group : item.name))!.id +
							">"	

			embed.addFields([{
				name: 	name,
				value: 	fieldValue,
				inline:	resultsOfPage.length > 5
			}])
		}

		return embed
	}

	private getSelectDropdown(defaultValue = "categories", locale: TranslationFunctions): ActionRowBuilder  {

        const optionsForEmbed: APISelectMenuOption[] = []

        optionsForEmbed.push({
            description: locale.COMMANDS.HELP.SELECT_MENU.TITLE(),
            label: "Categories",
            value: "categories",
            default: defaultValue === "categories"
        })

        for (const [category] of this._categories) {

            const description = locale.COMMANDS.HELP.SELECT_MENU.CATEGORY_DESCRIPTION({category})
            optionsForEmbed.push({
                description,
                label: category,
                value: category,
                default: defaultValue === category
            })
        }

        const selectMenu = new StringSelectMenuBuilder().addOptions(optionsForEmbed).setCustomId("help-category-selector")
        
		return new ActionRowBuilder().addComponents(selectMenu)
    }

	loadCategories(): void {

		const commands: CommandCategory[] = MetadataStorage.instance.applicationCommandSlashesFlat as CommandCategory[]
		
		for (const command of commands) {

			const { category } = command
			if (!category || !validString(category)) continue

			if (this._categories.has(category)) {
				this._categories.get(category)?.push(command)
			} else {
				this._categories.set(category, [command])
			}
		}
	}
}