import { Client } from "discordx"
import { User as DUser} from "discord.js"

import { User, Guild } from "@entities"
import { Database, Logger, Stats } from "@services"
import { waitForDependencies, waitForDependency } from "@utils/functions"

/**
 * Add a active user to the database if doesn't exist.
 * @param user 
 */
export const syncUser = async (user: DUser) => {
    
    const  [ db, stats, logger ] = await waitForDependencies([Database, Stats, Logger])

    const userRepo = db.getRepo(User)

    const userData = await userRepo.findOne({
        userId: user.id
    })

    if (!userData) {

        // add user to the db
        const newUser = new User()
        newUser.userId = user.id
        await userRepo.persistAndFlush(newUser)

        // record new user both in logs and stats
        stats.register('NEW_USER', user.id)
        logger.logNewUser(user)
    }
}

/**
 * Sync a guild with the database.
 * @param guildId 
 * @param client 
 */
export const syncGuild = async (guildId: string, client: Client) => {
    const  [ db, stats, logger ] = await waitForDependencies([Database, Stats, Logger])

    const guildRepo = db.getRepo(Guild),
          guildData = await guildRepo.findOne({ guildId, deleted: false })

    const fetchedGuild = await client.guilds.fetch(guildId)

    //check if this guild exists in the database, if not it creates it (or recovers it from the deleted ones)
    if (!guildData) {

        const deletedGuildData = await guildRepo.findOne({ guildId, deleted: true })

        if (deletedGuildData) {
            // recover deleted guild
            
            deletedGuildData.deleted = false
            await guildRepo.persistAndFlush(deletedGuildData)

            stats.register('RECOVER_GUILD', guildId)
            logger.logGuild('RECOVER_GUILD', guildId)
        }
        else {
            // create new guild
        
            const newGuild = new Guild()
            newGuild.guildId = guildId
            await guildRepo.persistAndFlush(newGuild)

            stats.register('NEW_GUILD', guildId)
            logger.logGuild('NEW_GUILD', guildId)
        }

    }
    else if (!fetchedGuild) {
        // guild is deleted but still exists in the database

        guildData.deleted = true
        await guildRepo.persistAndFlush(guildData)

        stats.register('DELETE_GUILD', guildId)
        logger.logGuild('DELETE_GUILD', guildId)
    }
}

/**
 * Sync all guilds with the database.
 * @param client 
 */
export const syncAllGuilds = async (client: Client)  => {
    const db = await waitForDependency(Database)

    // add missing guilds
    const guilds = client.guilds.cache
    for (const guild of guilds) {
        await syncGuild(guild[1].id, client)
    }

    // remove deleted guilds
    const guildRepo = db.getRepo(Guild)
    const guildsData = await guildRepo.getActiveGuilds()
    for (const guildData of guildsData) {
        await syncGuild(guildData.guildId, client)
    }
}