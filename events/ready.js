var index = 0

module.exports = class {
    
    async run () {
        
        client.startingConsole()
        
        setInterval(() => {
            
            //activity change
            let activity = config.activities[index]
            if (activity.type === "STREAMING") {
                //streaming activity
                bot.user.setStatus('available')
                bot.user.setActivity(activity.text, {
                    "url": "https://www.twitch.tv/discord",
                    "type": "STREAMING"
                })
            } else {
                //other activities
                bot.user.setActivity(activity.text, {
                    type: activity.type
                }) //different activities : 'PLAYING', 'WATCHING', 'LISTENING'
            }
            index++
            if (index === config.activities.length) index = 0
            
            
            //stats update
            client.updateStats()
            
        }, 15 * 1000) //each 15 sec
        
    }
    
    
    
}