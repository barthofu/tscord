import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Guild {

    @PrimaryGeneratedColumn()
    id: number
}
