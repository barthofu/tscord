import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => StatRepository })
export class Stat {

    [EntityRepositoryType]?: StatRepository

    @PrimaryKey()
    id: number

    @Property()
    type!: string

    @Property()
    value: string = ''

    @Property({ type: 'json', nullable: true })
    additionalData?: any

    @Property()
    createdAt: Date = new Date()
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class StatRepository extends EntityRepository<Stat> { 

}