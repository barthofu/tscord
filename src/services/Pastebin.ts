import dayjs from 'dayjs'
import { Paste, RentryClient } from 'rentry-pastebin'

import { Schedule, Service } from '@/decorators'
import { Pastebin as PastebinEntity } from '@/entities'
import { Database } from '@/services'

@Service()
export class Pastebin {

	private client: RentryClient = new RentryClient()

	constructor(
		private db: Database
	) {
		this.client.createToken()
	}

	private async waitForToken(): Promise<void> {
		while (!this.client.getToken())
			await new Promise(resolve => setTimeout(resolve, 100))
	}

	async createPaste(content: string, lifetime?: number): Promise<Paste | undefined> {
		await this.waitForToken()

		const paste = await this.client.createPaste({ content })

		const pasteEntity = new PastebinEntity()
		pasteEntity.id = paste.url
		pasteEntity.editCode = paste.editCode
		if (lifetime)
			pasteEntity.lifetime = Math.floor(lifetime)

		await this.db.get(PastebinEntity).persistAndFlush(pasteEntity)

		return paste.paste
	}

	async deletePaste(id: string): Promise<void> {
		await this.waitForToken()

		const paste = await this.db.get(PastebinEntity).findOne({ id })

		if (!paste)
			return

		await this.client.deletePaste(id, paste.editCode)
		await this.db.get(PastebinEntity).remove(paste)
	}

	@Schedule('*/30 * * * *')
	private async autoDelete(): Promise<void> {
		const pastes = await this.db.get(PastebinEntity).find({ lifetime: { $gt: 0 } })

		for (const paste of pastes) {
			const diff = dayjs().diff(dayjs(paste.createdAt), 'day')

			if (diff >= paste.lifetime)
				await this.client.deletePaste(paste.id, paste.editCode)
		}
	}

}
