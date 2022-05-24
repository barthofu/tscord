import { Database } from '@core/Database'
import { injectable } from 'tsyringe'

@injectable()
export class Logger {

    constructor(
        private db: Database
    ) {}

}