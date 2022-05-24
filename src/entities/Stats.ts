import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { CustomBaseEntity } from './BaseEntity'

@Entity()
export class Stats {

    @PrimaryKey()
    id: number

    @Property()
    action!: string

    @Property()
    value: string

    @Property()
    createdAt: Date = new Date()
}
