import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Stat {

    @PrimaryKey()
    id: number

    @Property()
    type!: string

    @Property()
    value: string = ''

    @Property({ type: 'json', nullable: true })
    additionalData?: any

    @Property()
    createdAt: Date = new Date()
}
