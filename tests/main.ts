import { Database } from '@core/Database'
import { Entity, PrimaryKey, Property, EntityRepositoryType } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'
import { container, singleton } from 'tsyringe'

import { CustomBaseEntity } from '../src/entities/BaseEntity'

@Entity({ customRepository: () => GuildRepository })
export class Guild extends CustomBaseEntity {

    [EntityRepositoryType]?: GuildRepository

    @PrimaryKey()
    id: number

    @Property()
    name: string
}

@singleton()
export class GuildRepository extends EntityRepository<Guild> { 

    async test() {
        
        console.log(1)
    }
}

const repo = container.resolve(Database).em.getRepository(Guild)

repo.test()