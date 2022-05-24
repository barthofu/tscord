import { Database } from '@core/Database'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export class Logger {

    constructor(
        private db: Database
    ) {}

}