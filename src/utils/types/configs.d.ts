type GeneralConfigType = {

	name: string
	description: string
	version: string

	defaultLocale: import('@/i18n').Locales
	timezone: string

	simpleCommandsPrefix: string
	automaticDeferring: boolean

	links: {
		botInvite: string
		supportServer: string
		gitRemoteRepo: string
	}

	automaticUploadImagesToImgur: boolean

	ownerId: string
	devs: string[]
	testGuildId: string

	activities: {
		type: 'PLAYING' | 'LISTENING' | 'WATCHING' | 'STREAMING' | 'COMPETING' | 'CUSTOM'
		text: string
	}[]

}

type DatabaseConfigType = {

	path: `${string}/`

	backup: {
		enabled: boolean
		path: `${string}/`
	}
}

type LogsConfigType = {

	debug: boolean
	logTailMaxSize: number

	archive: {
		enabled: boolean
		retention: number
	}

	interaction: {
		file: boolean
		console: boolean
		channel: string | null

		exclude: InteractionsConstants[]
	}

	simpleCommand: {
		file: boolean
		console: boolean
		channel: string | null
	}

	newUser: {
		file: boolean
		console: boolean
		channel: string | null
	}

	guild: {
		file: boolean
		console: boolean
		channel: string | null
	}

	error: {
		file: boolean
		console: boolean
		channel: string | null
	}
}

type StatsConfigType = {

	interaction: {

		exclude: InteractionsConstants[]
	}
}

type APIConfigType = {

	enabled: boolean
	port: number
}
