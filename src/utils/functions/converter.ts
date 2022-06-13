/**
 * Change a date timezone to the one defined in the config.
 * @param date 
 * @param tzString 
 */

export const convertTZ = (date: Date, tzString: string): Date => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}