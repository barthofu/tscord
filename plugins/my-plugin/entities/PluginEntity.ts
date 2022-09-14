import { Entity, PrimaryKey, Property, EntityRepositoryType } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => PluginEntityRepository })
export class PluginEntity {

    [EntityRepositoryType]?: PluginEntityRepository

    @PrimaryKey({ autoincrement: false })
    id: string

}    

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class PluginEntityRepository extends EntityRepository<PluginEntity> { 

}