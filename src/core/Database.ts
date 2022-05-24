import { singleton } from 'tsyringe'
import { EntityManager, EntityName, MikroORM } from '@mikro-orm/core'

@singleton()
export class Database {

    private _orm: MikroORM

    public async initialize() {
        this._orm = await MikroORM.init()
    }

    public getOrm() {
        return this.orm
    }

    get orm(): MikroORM {
        return this._orm
    }

    get em(): EntityManager {
        return this.orm.em
    }

    getRepo<T>(entity: EntityName<T>) {
        return this.orm.em.getRepository<T>(entity)
    }
    
}