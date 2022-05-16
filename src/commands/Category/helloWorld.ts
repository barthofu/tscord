import { CommandInteraction } from 'discord.js'
import SlashCommand from '@core/SlashCommand'

// const commandParams = {

//     name: "helloWorld",
//     description: {
//         en: "Sends a random hentai image",
//         fr: "Envoie une image hentai aléatoire",
//     },

//     enabled: true,
//     dm: true,
//     nsfw: true,
    
//     cooldown: 4000
// }

export default class HelloWorld extends SlashCommand {

    name = 'helloWorld'
    description = {
        en: "Reply: Hello world!",
        fr: "Répond: Hello world!",
    }

    constructor() { 
        super(/* commandParams */) 
    }

    async run(interaction: CommandInteraction) {

        console.log(interaction)
        console.log('Hello world!')
    }
}