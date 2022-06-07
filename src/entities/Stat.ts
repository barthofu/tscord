import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Stat {

    @PrimaryKey()
    id: number

    @Property()
    type!: string

    @Property()
    value: string = ''

    @Property()
    createdAt: Date = new Date()
}
