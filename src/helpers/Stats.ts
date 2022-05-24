import { injectable, singleton } from 'tsyringe'
import { EntityRepository } from '@mikro-orm/core'

import { Database } from '@core/Database'
import { Stat } from '@entities'

import { getTypeOfInteraction, resolveAction } from '@utils/functions'
import { allInteractionTypes } from '@utils/types/interactions'
import { ArgsOf } from 'discordx'

@singleton()
@injectable()
export class Stats {

    private statsDb: EntityRepository<Stat>

    constructor(
        private db: Database
    ) {
        this.statsDb = this.db.getRepo(Stat)
    }

    async registerInteraction([interaction]: ArgsOf<'interactionCreate'>) {

        // we extract data from the interaction
        const type = getTypeOfInteraction(interaction)
        const action = resolveAction(interaction)

        // add it to the db
        const stat = new Stat()
        stat.type = type
        stat.action = action
        await this.statsDb.persistAndFlush(stat)
    }

}