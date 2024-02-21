import { Image } from '@/entities'
import { Database } from '@/services'
import { resolveDependency } from '@/utils/functions'

/**
 * Abstraction level for the image repository that will find an image by its name (with or without extension).
 * @param imageName
 * @returns image url
 */
export async function getImage(imageName: string): Promise<string | null> {
	const db = await resolveDependency(Database)
	const imageRepo = db.get(Image)

	const image = await imageRepo.findOne({
		$or: [
			{ fileName: imageName },
			{ fileName: `${imageName}.png` },
			{ fileName: `${imageName}.jpg` },
			{ fileName: `${imageName}.jpeg` },
			{ fileName: `${imageName}.gif` },
		],
	})

	return image?.url || null
}
