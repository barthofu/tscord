import { authenticated } from "@api/middlewares"
import { databaseConfig } from "@config"
import { Database } from "@services"
import { BaseController } from "@utils/classes"
import { formatDate } from "@utils/functions"
import type { Request, Response } from "express"
import { BodyParam, Get, JsonController, Post, UseBefore } from "routing-controllers"
import { injectable } from "tsyringe"

@JsonController('/database')
@UseBefore(
    authenticated
)
@injectable()
export class DatabaseController extends BaseController {

    constructor(
        private readonly db: Database
    ) {
        super()
    }

    @Post('/backup')
    async generateBackup(req: Request, res: Response) {

        console.debug(req, res)

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
        else this.error(res, "Couldn't generate backup, see the logs for more informations", 500)

    }

    @Post('/restore')
    async restoreBackup(
        @BodyParam('snapshotName', { required: true, type: String }) snapshotName: string,
        req: Request, res: Response
    ) {
        
        const success = await this.db.restore(snapshotName)
        console.debug(success)
        if (success) return { message: "Backup restored" }
        else this.error(res, "Couldn't restore backup, see the logs for more informations", 500)
    }

    @Get('/backup/list')
    async getBackupList(req: Request, res: Response) {

        const backupPath = databaseConfig.backup.path
        if (!backupPath) {
            return this.error(res, "Couldn't list backups, see the logs for more informations", 500)
        }

        const backupList = this.db.getBackupList()

        if (backupList) return backupList
        else this.error(res, "Couldn't list backups, see the logs for more informations", 500)
    }

    @Get('/size')
    async size() {

        return await this.db.getSize()
    }
}