/**
 * Ensures value(s) strings and has a size after trim
 * @param strings
 * @returns {boolean}
 */
export const validString = (...strings: Array<unknown>): boolean => {
    
    if (strings.length === 0) return false
    
    for (const currString of strings) {
        
        if (!currString) return false
        if (typeof currString !== "string") return false
        if (currString.length === 0) return false
        if (currString.trim().length === 0) return false
    }

    return true
}