import { container } from "tsyringe"
import { User as DUser } from "discord.js"

import { Database } from "@core/Database"
import { User } from "@entities"
import { Logger, Stats } from "@helpers"

const db = container.resolve(Database)

export const checkUser = async (user: DUser) => {

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