import { RequestContext } from '@mikro-orm/core'
import { Database } from '@services'
import { resolveDependency } from '@utils/functions'
import type { ArgsOf, GuardFunction } from 'discordx'
  
/**
 * Isolate all the handling pipeline to prevent any MikrORM global identity map issues
 */
export const RequestContextIsolator: GuardFunction = async (_, client, next) => {

    const db = await resolveDependency(Database)
    RequestContext.create(db.orm.em, next)
}