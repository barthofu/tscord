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

    @PrimaryKey()
    id: number

    @Property()
    fileName: string

    @Property({ default: '' })
    basePath?: string

    @Property()
    url: string

    @Property()
    size: number

    @Property()
    tags: string[]

    @Property()
    hash: string

    @Property()
    deleteHash: string

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

@singleton()
export class ImageRepository extends EntityRepository<Image> { 
    async findByTags(tags: string[], explicit: boolean = true): Promise<Image[]> {
        const rows =  await this.find({
            $and: tags.map(tag => ({ tags: new RegExp(tag) }))
        });

        return explicit ? rows.filter(row => row.tags.length === tags.length) : rows;
    }
}