import { Entity, PrimaryKey } from '@mikro-orm/core'
import { CustomBaseEntity } from './BaseEntity'

@Entity()
export class Guild extends CustomBaseEntity {

    @PrimaryKey()
    id: number
}
