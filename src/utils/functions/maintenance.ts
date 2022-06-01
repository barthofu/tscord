import { container } from "tsyringe"

import { Database } from "@core/Database"
import { Data } from "@entities"

export const isInMaintenance = async (): Promise<boolean> => {
            
    const dataRepository = container.resolve(Database).getRepo(Data)
    const maintenance = await dataRepository.get("maintenance")
    
    return !!maintenance as boolean
}

export const setMaintenance = async (maintenance: boolean) =>  {

    const dataRepository = container.resolve(Database).getRepo(Data)
    await dataRepository.set('maintenance', maintenance)
}