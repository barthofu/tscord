import fs from "fs"

/**
 * Change a date timezone to the one defined in the config.
 * @param date 
 * @param tzString 
 */

export const convertTZ = (date: Date, tzString: string): Date => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}))  
}

/**
 * Function to encode file data to base64 encoded string
 * @param file - file to encode
 */
export const base64Encode = (file: string) => {
    // read binary data
    var bitmap = fs.readFileSync(file)
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64')
}
