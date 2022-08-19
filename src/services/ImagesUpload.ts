import { singleton } from "tsyringe"
import fs from "fs"
import { ImgurClient } from "imgur"
import { imageHash as callbackImageHash } from "image-hash"
import { promisify } from "util"
import axios from "axios"

import { Database, Logger } from "@services"
import { Image, ImageRepository } from "@entities"
import { base64Encode } from "@utils/functions"
import chalk from "chalk"

const imageHasher = promisify(callbackImageHash)

@singleton()
export class ImagesUpload {

    private validImageExtensions = ['.png', '.jpg', '.jpeg']
    private imageFolderPath = `${__dirname}/../../assets/images`

    private imgurClient: ImgurClient | null = process.env.IMGUR_CLIENT_ID ?
        new ImgurClient({
            clientId: process.env.IMGUR_CLIENT_ID
        }) : null

    private imageRepo: ImageRepository

    constructor(
        private db: Database,
        private logger: Logger
    ) {
        this.imageRepo = this.db.getRepo(Image)
    }

    isValidImageFormat(file: string): boolean {
        for (const extension of this.validImageExtensions) {
            if (file.endsWith(extension)) {
                return true
            }
        }
        return false
    }

    async syncWithDatabase() {

        // add missing images to the database

        const images = fs.readdirSync(this.imageFolderPath).filter(file => this.isValidImageFormat(file))

        // check if the image is already in the database and that its md5 hash is the same.
        for (const imageFileName of images) {
            
            const imageHash = await imageHasher(
                `${this.imageFolderPath}/${imageFileName}`, 
                16, 
                true
            ) as string

            const imageInDb = await this.imageRepo.findOne({ 
                fileName: imageFileName,
                hash: imageHash 
            })

            if (!imageInDb) await this.addNewImageToImgur(imageFileName, imageHash)
        }

        // remove images from the database that are not anymore in the filesystem
        
        const imagesInDb = await this.imageRepo.findAll()

        for (const image of imagesInDb) {

            // delete the image if it is not in the filesystem anymore
            if (!images.includes(image.fileName)) {

                await this.imageRepo.remove(image).flush()

                await this.deleteImageFromImgur(image)
            }

            // reupload if the image is not on imgur anymore
            if (!await this.isImgurImageValid(image.url)) {
                
                await this.imageRepo.remove(image).flush()

                await this.addNewImageToImgur(image.fileName, image.hash, true)
            }

        }

    }

    async deleteImageFromImgur(image: Image) {

        if (!this.imgurClient) return

        await this.imgurClient.deleteImage(image.deleteHash)

        this.logger.log(
            'info', 
            `Image ${image.fileName} deleted from database because it is not in the filesystem anymore`, 
            true
        )
    }

    async addNewImageToImgur(imageFileName: string, imageHash: string, reupload: boolean = false) {

        if (!this.imgurClient) return

        // upload the image to imgur
        const base64 = base64Encode(`${this.imageFolderPath}/${imageFileName}`)
        
        try {

            const uploadResponse = await this.imgurClient.upload({
                image: base64,
                type: 'base64',
                name: imageFileName.split('')[0]
            })

            if (!uploadResponse.success ) {
                this.logger.log(
                    'error',
                    `Error uploading image ${imageFileName} to imgur: ${uploadResponse.status} ${uploadResponse.data}`,
                    true
                )
                return
            }

            // add the image to the database
            const image = new Image()
            image.fileName = imageFileName
            image.url = uploadResponse.data.link
            image.hash = imageHash
            image.deleteHash = uploadResponse.data.deletehash || ''
            image.size = uploadResponse.data.size
            await this.imageRepo.persistAndFlush(image)

            // log the success
            this.logger.log(
                'info',
                `Image ${chalk.bold.green(imageFileName)} uploaded to imgur`,
                true
            )

        } 
        catch (error: any) {
            this.logger.log('error', error?.toString(), true)
        }
    }

    async isImgurImageValid(imageUrl: string): Promise<boolean> {

        if (!this.imgurClient) return false

        const res = await axios.get(imageUrl)

        return !res.request?.path.includes('/removed')        
    }
}