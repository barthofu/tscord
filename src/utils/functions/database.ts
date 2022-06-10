import { container } from 'tsyringe'

import { Database } from '@core/Database'
import { Data } from '@entities'

import { defaultData } from '../../../database/data'

type DataType = keyof typeof defaultData

export const initDataTable = async () => {

    const db = container.resolve(Database)

    for (const key of Object.keys(defaultData)) {

        const dataRepository = db.getRepo(Data)

        await dataRepository.add(
            key as DataType, 
            defaultData[key as DataType]
        )
    }
}