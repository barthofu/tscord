export const generalConfig: GeneralConfigType = {

    __templateVersion: '1.1.0',

	name: 'tscord',
	description: '',
	defaultLocale: 'en',
	simpleCommandsPrefix: '!',
	ownerId: process.env['BOT_OWNER_ID'] || '',
	timezone: 'Europe/Paris',

	links: {
		invite: 'https://www.change_invite_link_here.com',
		supportServer: 'https://discord.com/your_invitation_link',
		gitRemoteRepo: 'https://github.com/barthofu/tscord',
	},
	
	automaticUploadImagesToImgur: true,

	// you don't have to put the owner id here, it is added automatically
	devs: [],

	eval: {
		name: 'bot',
		onlyOwner: false
	},

    activities: [
		{
			text: 'discord.js v14',
			type: 'PLAYING'
		},
		{
			text: 'some knowledge',
			type: 'STREAMING'
		}
	]

}

export const colorsConfig = {

	primary: '#2F3136'
}
