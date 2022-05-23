import { Entity, PrimaryKey } from '@mikro-orm/core'

@Entity()
export class Guild {

    @PrimaryKey()
    id: number
}
