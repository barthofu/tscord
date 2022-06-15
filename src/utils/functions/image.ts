import { Database } from "@services"
import { Image } from "@entities"
import { container } from "tsyringe"

/**
 * Abstraction level for the image repository that will find an image by its name (with or withouth extension).
 * @param imageName 
 * @returns image url
 */
export const getImage = async (imageName: string): Promise<string | null> => {

    const imageRepo = container.resolve(Database).getRepo(Image)

    let image = await imageRepo.findOne({
        $or: [
            { fileName: imageName },
            { fileName: `${imageName}.png` },
            { fileName: `${imageName}.jpg` },
            { fileName: `${imageName}.jpeg` },
            { fileName: `${imageName}.gif` },
        ]
    })

    return image?.url || null
}