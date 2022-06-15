import { singleton } from "tsyringe"
import fs from "fs"
import { ImgurClient } from "imgur"
import { imageHash as callbackImageHash } from "image-hash"
import { promisify } from "util"

import { Database, Logger } from "@services"
import { Image, ImageRepository } from "@entities"
import { base64Encode } from "@utils/functions"

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

    async synchroWithDatabase() {

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

            if (!imageInDb) await this.addNewImage(imageFileName, imageHash)
        }

        // remove images from the database that are not anymore in the filesystem
        
        const imagesInDb = await this.imageRepo.findAll()

        for (const image of imagesInDb) {
            if (!images.includes(image.fileName)) {
                await this.imageRepo.remove(image)
            }
        }
    }

    async addNewImage(imageFileName: string, imageHash: string) {

        if (!this.imgurClient) return

        // upload the image to imgur
        const base64 = base64Encode(`${this.imageFolderPath}/${imageFileName}`)
        
        try {

            const uploadResponse = await this.imgurClient.upload({
                image: base64,
                type: 'base64',
                name: imageFileName.split('')[0]
            })

            // add the image to the database
            const image = new Image()
            image.fileName = imageFileName
            image.url = uploadResponse.data?.link
            image.hash = imageHash
            await this.imageRepo.persistAndFlush(image)

            // log the success
            this.logger.log(
                'info', 
                `Image ${imageFileName} uploaded to imgur`, 
                true)

        } 
        catch (error: any) {
            this.logger.log('error', error?.toString())
        }
    }
}