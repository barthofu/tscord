import { RequestContext } from '@mikro-orm/core'
import { GuardFunction } from 'discordx'

import { Database } from '@/services'
import { resolveDependency } from '@/utils/functions'

/**
 * Isolate all the handling pipeline to prevent any MikrORM global identity map issues
 */
export const RequestContextIsolator: GuardFunction = async (_, client, next) => {
	const db = await resolveDependency(Database)
	RequestContext.create(db.orm.em, next)
}
