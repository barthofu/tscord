import fs from "fs"

/**
 * recursively get files paths from a directory
 * @param path 
 */
export const getFiles = (path: string): string[] => {

    if (!fs.existsSync(path)) return []

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

export const fileOrDirectoryExists = (path: string): boolean => {
    return fs.existsSync(path)
}

export const getSourceCodeLocation = (): string => {
    return process.cwd() + '/' + (process.env['NODE_ENV'] === 'production' ? 'build' : 'src')
}