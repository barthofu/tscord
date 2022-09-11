import fs from 'fs'

/**
 * recursively get files paths from a directory
 * @param path 
 */
export const getFiles = (path: string): string[] => {

    const files = fs.readdirSync(path)
    const fileList = []

    for (const file of files) {

        const filePath = `${path}/${file}`
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
            fileList.push(...getFiles(filePath))
        } else {
            fileList.push(filePath)
        }
    }

    return fileList
}