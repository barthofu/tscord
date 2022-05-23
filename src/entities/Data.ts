import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/sqlite"
import { singleton } from "tsyringe"

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => DataRepository })
export class Data {

    [EntityRepositoryType]?: DataRepository

    @PrimaryKey()
    key: string

    @Property()
    value: string
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

@singleton()
export class DataRepository extends EntityRepository<Data> {

    async get(key: string): Promise<any> {

        const data = await this.findOne({ key })

        if (!data?.value) return null

        try {
            return JSON.parse(data.value)
        }
        catch (e) {
            return data.value
        }
    }

    async set(key: string, value: any): Promise<void> {

        const data = await this.get(key)

        if (!data) {

            const newData = new Data()
            newData.key = key
            newData.value = JSON.stringify(value)

            await this.persistAndFlush(newData)
        }
        else {
            data.value = JSON.stringify(value)
            await this.flush()
        }
    }

    async add(key: string, value: any): Promise<void> {

        const data = await this.get(key)

        if (!data) {

            const newData = new Data()
            newData.key = key
            newData.value = JSON.stringify(value)

            await this.persistAndFlush(newData)
        }
    }
}