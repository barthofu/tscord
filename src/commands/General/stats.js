const commandParams = {
    
    name: '',
    aliases: [],
    args: [],
    desc: {
        en: 'Gives stats graphics about the bot.',
        fr: 'Fournis différents graphiques d\'évolution des stats du bot.'
    },
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

}

const stats = [
    { fancyName: 'Commands', path: 'commands.total' },
    { fancyName: 'Servers', path: 'guilds' },
    { fancyName: 'Active Users', path: 'activeUsers' },
]

const days = 30 //the period to cover with the stats

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, rawArgs, cmd) {
  
        const rawStats = db.stats.get('daily').value()
        let page = 1

        const m = await msg.channel.send({ embeds: [this.getEmbed(msg, color, page, days, rawStats)] })
        await m.react('◀')
        await m.react('▶')
        
        const filter = (reaction, user) => reaction.users.cache.get(bot.user.id) && user.id === msg.author.id,
              reac = m.createReactionCollector({filter, time: 300000 })

        reac.on('collect', async(reaction) => {

            reaction.users.remove(msg.author.id)

            if (reaction.emoji.name == '◀') page = page == 1 ? 1 : page - 1
            else if (reaction.emoji.name == '▶') page = page == stats.length ? stats.length : page + 1

            await m.edit(this.getEmbed(msg, color, page, days, rawStats))
        })

    }


    getEmbed(msg, color, page, days, rawStats) {

        return new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setImage(this.genLink(page, days, rawStats))
            .setFooter(`${page}/${stats.length} | ${days} days`)
    }


    genLink(page, days, rawStats) {
        
        const obj = {
            
            type: 'line',
            'data': {
                labels: rawStats.slice(-days).map(val => val.date.slice(0,5).replace('-', '/')),
                datasets: [
                    {
                        label: '',
                        data: rawStats.slice(-days).map(val => eval(`val.${stats[page-1].path}`)),
                        fill: true,
                        backgroundColor: 'rgba(252,231,3,0.1)',
                        borderColor: 'rgb(252,186,3)',
                        borderCapStyle: 'round',
                        lineTension: 0.3
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: stats[page-1].fancyName,
                    fontColor: 'rgba(255,255,254,0.6)',
                    fontSize: 20,
                    padding: 15
                },
                legend: { display: false },
                scales: {
                    xAxes: [ { ticks: { fontColor: 'rgba(255,255,254,0.6)' } } ],
                    yAxes: [ { ticks: { fontColor: 'rgba(255,255,254,0.6)', beginAtZero: false } } ]
                }
            }
        }
    
        return `https://quickchart.io/chart?c=${JSON.stringify(obj)}&format=png`.split(' ').join('%20')
        
    }

}