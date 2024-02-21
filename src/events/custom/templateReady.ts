import { Discord, OnCustom } from '@/decorators'

@Discord()
export default class TemplateReadyEvent {

	// =============================
	// ========= Handlers ==========
	// =============================

	@OnCustom('templateReady')
	async templateReadyHandler() {

		// console.log('the template is fully ready!')
	}

}
