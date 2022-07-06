export const generalConfig: GeneralConfigType = {

    __templateVersion: '1.0.0',

	name: '',
	description: '',
	defaultLocale: 'en',
	simpleCommandsPrefix: '!',
	ownerId: 'YOUR_ID_HERE',
	timezone: 'Europe/Paris',
	automaticUploadImagesToImgur: true,
	inviteLink: 'https://www.change_invite_link_here.com',

	devs: [
		'YOUR_ID_HERE',
	],

	eval: {
		name: 'bot',
		onlyOwner: false
	},

    activities: [
		{
			text: 'discord.js v13',
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