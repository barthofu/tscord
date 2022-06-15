import { container } from "tsyringe"
import { User as DUser, Guild as DGuild } from "discord.js"

import { User, Guild } from "@entities"
import { Database, Logger, Stats } from "@services"
import { Client } from "discordx"

const db = container.resolve(Database)

/**
 * Add a active user to the database if doesn't exist.
 * @param user 
 */
export const syncUser = async (user: DUser) => {

    const userRepo = db.getRepo(User)

    const userData = await userRepo.findOne({
        id: user.id
    })

    if (!userData) {

        // add user to the db
        const newUser = new User()
        newUser.id = user.id
        await userRepo.persistAndFlush(newUser)

        // record new user both in logs and stats
        container.resolve(Stats).register('NEW_USER', user.id)
        container.resolve(Logger).logNewUser(user)
    }
}

/**
 * Sync a guild with the database.
 * @param guildId 
 * @param client 
 */
export const syncGuild = async (guildId: string, client: Client) => {

    const stats = container.resolve(Stats),
          logger = container.resolve(Logger)

    const guildRepo = db.getRepo(Guild),
          guildData = await guildRepo.findOne({ id: guildId, deleted: false })

    const fetchedGuild = client.guilds.cache.get(guildId)

    //check if this guild exists in the database, if not it creates it (or recovers it from the deleted ones)
    if (!guildData) {

        const deletedGuildData = await guildRepo.findOne({ id: guildId, deleted: true })

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
            newGuild.id = guildId
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

    // add missing guilds
    const guilds = client.guilds.cache
    for (const guild of guilds) {
        await syncGuild(guild[1].id, client)
    }

    // remove deleted guilds
    const guildRepo = db.getRepo(Guild)
    const guildsData = await guildRepo.find({ deleted: false })
    for (const guildData of guildsData) {
        await syncGuild(guildData.id, client)
    }
}