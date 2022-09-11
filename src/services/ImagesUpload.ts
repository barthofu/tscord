import { singleton } from "tsyringe"
import { ImgurClient } from "imgur"
import { imageHash as callbackImageHash } from "image-hash"
import { promisify } from "util"
import axios from "axios"

import { Database, Logger } from "@services"
import { Image, ImageRepository } from "@entities"
import { base64Encode, getFiles } from "@utils/functions"
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

        const images = getFiles(this.imageFolderPath)
            .filter(file => this.isValidImageFormat(file))
            .map(file => file.replace(this.imageFolderPath + '/', ''))

        // check if the image is already in the database and that its md5 hash is the same.
        for (const imagePath of images) {

            const imageFileName = imagePath.split('/').slice(-1)[0]
            
            const imageHash = await imageHasher(
                `${this.imageFolderPath}/${imagePath}`, 
                16, 
                true
            ) as string

            const imageInDb = await this.imageRepo.findOne({ 
                fileName: imageFileName,
                hash: imageHash 
            })

            if (!imageInDb) await this.addNewImageToImgur(imagePath, imageHash)
        }

        // remove images from the database that are not anymore in the filesystem
        
        const imagesInDb = await this.imageRepo.findAll()

        for (const image of imagesInDb) {

            const imagePath = `${image.basePath !== '' ? image.basePath + '/' : ''}${image.fileName}`

            // delete the image if it is not in the filesystem anymore
            if (!images.includes(imagePath)) {

                await this.imageRepo.remove(image).flush()
                await this.deleteImageFromImgur(image)
            }

            // reupload if the image is not on imgur anymore
            if (!await this.isImgurImageValid(image.url)) {
                
                await this.imageRepo.remove(image).flush()
                await this.addNewImageToImgur(imagePath, image.hash, true)
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
                    'error',
                    `Error uploading image ${imageFileName} to imgur: ${uploadResponse.status} ${uploadResponse.data}`,
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
                'info',
                `Image ${chalk.bold.green(imagePath)} uploaded to imgur`,
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