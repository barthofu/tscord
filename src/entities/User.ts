import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/sqlite'

import { CustomBaseEntity } from './BaseEntity'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => UserRepository })
export class User extends CustomBaseEntity {

    [EntityRepositoryType]?: UserRepository

    @PrimaryKey({ autoincrement: false })
    id!: string

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class UserRepository extends EntityRepository<User> { 

}