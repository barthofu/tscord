import { waitForDependency } from "@utils/functions"
import { Database } from "@services"
import { Data } from "@entities"

/**
 * Get the maintenance state of the bot.
 */
export const isInMaintenance = async (): Promise<boolean> => {
            
    const db = await waitForDependency(Database)
    const dataRepository = db.getRepo(Data)
    const maintenance = await dataRepository.get('maintenance')
    
    return maintenance
}

/**
 * Set the maintenance state of the bot.
 */
export const setMaintenance = async (maintenance: boolean) =>  {
    const db = await waitForDependency(Database)
    const dataRepository = db.getRepo(Data)
    await dataRepository.set('maintenance', maintenance)
}