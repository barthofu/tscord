import axios from "axios"
import chalk from "chalk"
import { imageHash as callbackImageHash } from "image-hash"
import { ImgurClient } from "imgur"
import { singleton } from "tsyringe"
import { promisify } from "util"

import { Image, ImageRepository } from "@entities"
import { Database, Logger } from "@services"
import { base64Encode, fileOrDirectoryExists, getFiles } from "@utils/functions"

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
        this.imageRepo = this.db.get(Image)
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

        if (!fileOrDirectoryExists(this.imageFolderPath)) this.logger.log('Image folder does not exist, couldn\'t sync with database', 'warn')

        // get all images inside the assets/images folder
        const images = getFiles(this.imageFolderPath)
            .filter(file => this.isValidImageFormat(file))
            .map(file => file.replace(this.imageFolderPath + '/', ''))


        // remove all images from the database that are not anymore in the filesystem
        const imagesInDb = await this.imageRepo.findAll()

        for (const image of imagesInDb) {
            const imagePath = `${image.basePath !== '' ? image.basePath + '/' : ''}${image.fileName}`

            // delete the image if it is not in the filesystem anymore
            if (!images.includes(imagePath)) {

                await this.imageRepo.remove(image).flush()
                await this.deleteImageFromImgur(image)
            } else if (!await this.isImgurImageValid(image.url)) {
                // reupload if the image is not on imgur anymore
                await this.addNewImageToImgur(imagePath, image.hash, true)
            }
        }

        // check if the image is already in the database and that its md5 hash is the same.
        for (const imagePath of images) {            
            const imageHash = await imageHasher(
                `${this.imageFolderPath}/${imagePath}`, 
                16, 
                true
            ) as string

            const imageInDb = await this.imageRepo.findOne({ 
                hash: imageHash,
            })

            if (!imageInDb) await this.addNewImageToImgur(imagePath, imageHash)
            else if (
                imageInDb && (
                imageInDb.basePath != imagePath.split('/').slice(0, -1).join('/') ||
                imageInDb.fileName != imagePath.split('/').slice(-1)[0] )
            ) console.warn(`Image ${chalk.bold.green(imagePath)} has the same hash as ${chalk.bold.green(imageInDb.basePath + (imageInDb.basePath?.length ? "/" : "") + imageInDb.fileName)} so it will skip`)
        }
    }

    async deleteImageFromImgur(image: Image) {

        if (!this.imgurClient) return

        await this.imgurClient.deleteImage(image.deleteHash)

        this.logger.log(
            `Image ${image.fileName} deleted from database because it is not in the filesystem anymore`, 
            'info',
            true
        )
    }

    async addNewImageToImgur(imagePath: string, imageHash: string, reupload: boolean = false) {

        if (!this.imgurClient) return

        // upload the image to imgur
        const base64 = base64Encode(`${this.imageFolderPath}/${imagePath}`)
        
        try {

            const imageFileName = imagePath.split('/').slice(-1)[0],
                  imageBasePath = imagePath.split('/').slice(0, -1).join('/')

            const uploadResponse = await this.imgurClient.upload({
                image: base64,
                type: 'base64',
                name: imageFileName
            })

            if (!uploadResponse.success ) {
                this.logger.log(
                    `Error uploading image ${imageFileName} to imgur: ${uploadResponse.status} ${uploadResponse.data}`,
                    'error',
                    true
                )
                return
            }

            // add the image to the database
            const image = new Image()
            image.fileName = imageFileName
            image.basePath = imageBasePath
            image.url = uploadResponse.data.link
            image.size = uploadResponse.data.size
            image.tags = imageBasePath.split('/')
            image.hash = imageHash
            image.deleteHash = uploadResponse.data.deletehash || ''
            await this.imageRepo.persistAndFlush(image)

            // log the success
            this.logger.log(
                `Image ${chalk.bold.green(imagePath)} uploaded to imgur`,
                'info',
                true
            )

        } 
        catch (error: any) {
            this.logger.log(error?.toString(), 'error', true)
        }
    }

    async isImgurImageValid(imageUrl: string): Promise<boolean> {

        if (!this.imgurClient) return false

        const res = await axios.get(imageUrl)

        return !res.request?.path.includes('/removed')        
    }
}