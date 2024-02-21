import { constant } from "case"

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

export const oneLine = (strings: TemplateStringsArray, ...keys: any[]) => {

    return strings
        .reduce((result, part, i) => result + part + (keys[i] ?? '') , '')
        .replace(/(?:\n(?:\s*))+/g, ' ')
        .split('\NEWLINE')
        .join('\n')
        .trim()
}

export const numberAlign = (number: number, align: number = 2) => {

    return number.toString().padStart(align, ' ')
}

export const constantPreserveDots = (string: string) => {
    
    return string
        .split('.')
        .map(word => constant(word))
        .join('.')
}

export const isValidUrl = (url: string) => {
    
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}