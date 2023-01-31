import { BodyParams, Controller, Get, Post, UseBefore } from "@tsed/common"
import { InternalServerError } from "@tsed/exceptions"
import { Required } from "@tsed/schema"
import { injectable } from "tsyringe"

import { Authenticated } from "@api/middlewares"
import { databaseConfig } from "@configs"
import { Database } from "@services"
import { BaseController } from "@utils/classes"
import { formatDate, resolveDependencies } from "@utils/functions"

@Controller('/database')
@UseBefore(
    Authenticated
)
@injectable()
export class DatabaseController extends BaseController {

    private db: Database

    constructor() {
        super()

        resolveDependencies([Database]).then(([db]) => {
            this.db = db
        })
    }

    @Post('/backup')
    async generateBackup() {

        const snapshotName = `snapshot-${formatDate(new Date(), 'onlyDateFileName')}-manual-${Date.now()}`
        const success = await this.db.backup(snapshotName)

        if (success) {
            return { 
                message: 'Backup generated',
                data: {
                    snapshotName: snapshotName + '.txt'
                }
            }
        }
        else throw new InternalServerError("Couldn't generate backup, see the logs for more information")
    }

    @Post('/restore')
    async restoreBackup(
        @Required() @BodyParams('snapshotName') snapshotName: string,
    ) {
        
        const success = await this.db.restore(snapshotName)

        if (success) return { message: "Backup restored" }
        else throw new InternalServerError("Couldn't restore backup, see the logs for more information")
    }

    @Get('/backups')
    async getBackups() {

        const backupPath = databaseConfig.backup.path
        if (!backupPath) throw new InternalServerError("Backup path not set, couldn't find backups")

        const backupList = this.db.getBackupList()

        if (backupList) return backupList
        else throw new InternalServerError("Couldn't get backup list, see the logs for more information")
    }

    @Get('/size')
    async size() {

        return await this.db.getSize()
    }
}