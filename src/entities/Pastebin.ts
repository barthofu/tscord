import { Entity, EntityRepositoryType, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb';
import { EntityRepository } from '@mikro-orm/sqlite'

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => PastebinRepository })
export class Pastebin {

	[EntityRepositoryType]?: PastebinRepository

	@PrimaryKey()
	_id: ObjectId;

    @SerializedPrimaryKey()
    id!: string; // won't be saved in the database

	@Property()
    editCode: string

	@Property()
    lifetime: number = -1

	@Property()
    createdAt: Date = new Date()

}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class PastebinRepository extends EntityRepository<Pastebin> {

}
