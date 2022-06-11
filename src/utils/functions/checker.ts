import { container } from "tsyringe"

import { Database } from "@core/Database"
import { User } from "@entities"
import { Logger, Stats } from "@helpers"

const db = container.resolve(Database)

export const checkUser = async (userId: string) => {

    const userRepo = db.getRepo(User)

    const userData = await userRepo.findOne({
        id: userId
    })

    if (!userData) {

        // add user to the db
        const user = new User()
        user.id = userId
        await userRepo.persistAndFlush(user)

        // record new user both in logs and stats
        container.resolve(Stats).register('NEW_USER', userId)
        container.resolve(Logger).logNewUser(userId)
    }
}