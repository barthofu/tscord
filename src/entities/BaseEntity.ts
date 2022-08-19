import { PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core"
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class CustomBaseEntity {
    @PrimaryKey()
    _id: ObjectId;

    @SerializedPrimaryKey()
    id!: string; // won't be saved in the database
    
    @Property()
    createdAt: Date = new Date()

    @Property({ onUpdate: () => new Date()})
    updatedAt: Date = new Date()
}