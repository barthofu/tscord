/** 
 * Split an array into chunks of a given size
 * @param array The array to split
 * @param chunkSize The size of each chunk (default to 2)
 */
export const chunkArray = <T>(array: T[], chunkSize: number = 2): T[][] => {

    const newArray: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
        newArray.push(array.slice(i, i + chunkSize))
    }

    return newArray
}