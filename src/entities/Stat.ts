import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Stat {

    @PrimaryKey()
    id: number

    @Property()
    type!: string

    @Property()
    action: string = ''

    @Property()
    createdAt: Date = new Date()
}
