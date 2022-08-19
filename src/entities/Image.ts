import { Entity, PrimaryKey, Property, EntityRepositoryType } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'
import { singleton } from 'tsyringe'

import { CustomBaseEntity } from './BaseEntity'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => ImageRepository })
export class Image extends CustomBaseEntity {

    [EntityRepositoryType]?: ImageRepository

    @Property()
    fileName: string

    @Property()
    url: string

    @Property()
    hash: string

    @Property()
    deleteHash: string

    @Property()
    size: number
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

@singleton()
export class ImageRepository extends EntityRepository<Image> { 

}