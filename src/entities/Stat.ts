import { Entity, EntityRepositoryType, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb';
import { EntityRepository } from '@mikro-orm/sqlite'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => StatRepository })
export class Stat {

    [EntityRepositoryType]?: StatRepository

    @PrimaryKey()
    _id: ObjectId;

    @SerializedPrimaryKey()
    id!: string; // won't be saved in the database

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