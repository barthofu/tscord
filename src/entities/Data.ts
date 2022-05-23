import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Data {

    @PrimaryColumn()
    key: string

    @Column()
    value: string
}
