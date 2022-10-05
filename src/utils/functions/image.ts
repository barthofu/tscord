import { waitForDependency } from "@utils/functions"
import { Database } from "@services"
import { Image } from "@entities"

/**
 * Abstraction level for the image repository that will find an image by its name (with or without extension).
 * @param imageName 
 * @returns image url
 */
export const getImage = async (imageName: string): Promise<string | null> => {

    const db = await waitForDependency(Database)
    const imageRepo = db.get(Image)

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