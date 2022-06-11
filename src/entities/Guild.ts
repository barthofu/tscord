import { Entity, PrimaryKey, Property, EntityRepositoryType } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'
import { singleton } from 'tsyringe'

import { CustomBaseEntity } from './BaseEntity'

@Entity({ customRepository: () => GuildRepository })
export class Guild extends CustomBaseEntity {

    [EntityRepositoryType]?: GuildRepository

    @PrimaryKey({ autoincrement: false })
    id!: string

    @Property({ nullable: true, type: 'string' })
    prefix: string | null
}

@singleton()
export class GuildRepository extends EntityRepository<Guild> { 

}