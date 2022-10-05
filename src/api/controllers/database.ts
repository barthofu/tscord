import { authenticated } from "@api/middlewares"
import { databaseConfig } from "@config"
import { Database } from "@services"
import { BaseController } from "@utils/classes"
import { formatDate } from "@utils/functions"
import type { Request, Response } from "express"
import { BodyParam, Get, InternalServerError, JsonController, Post, UseBefore } from "routing-controllers"
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
        @BodyParam('snapshotName', { required: true, type: String }) snapshotName: string,
        req: Request, res: Response
    ) {
        
        const success = await this.db.restore(snapshotName)

        if (success) return { message: "Backup restored" }
        else throw new InternalServerError("Couldn't restore backup, see the logs for more information")
    }

    @Get('/backups')
    async getBackups(req: Request, res: Response) {

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