import { Slash, Discord, SlashOption, On } from "@decorators"
import { setMaintenance } from "@utils/functions"

@Discord()
export default class Maintenance {

	@Slash("maintenance")
	async maintenance(
		@SlashOption('state') state: boolean,
	): Promise<void> {
		
		await setMaintenance(state)
	}
}