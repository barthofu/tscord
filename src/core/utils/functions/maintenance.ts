import { Data } from "@entities"
import { Database } from "@services"
import { resolveDependency } from "@utils/functions"

/**
 * Get the maintenance state of the bot.
 */
export const isInMaintenance = async (): Promise<boolean> => {
            
    const db = await resolveDependency(Database)
    const dataRepository = db.get(Data)
    const maintenance = await dataRepository.get('maintenance')
    
    return maintenance
}

/**
 * Set the maintenance state of the bot.
 */
export const setMaintenance = async (maintenance: boolean) =>  {
    const db = await resolveDependency(Database)
    const dataRepository = db.get(Data)
    await dataRepository.set('maintenance', maintenance)
}