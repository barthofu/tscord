var index = 0

module.exports = class {
    
    async run () {
        
        client.startingConsole()
        checker.checkGuilds()
        logger.log("connected")
        
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
        
            //daily check
            checker.checkDaily()
            
        }, 15 * 1000) //each 15 sec
        
    }
    
    
    
}