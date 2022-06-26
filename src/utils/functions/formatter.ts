import dateformat from "date-and-time"

import { convertTZ } from "./converter"

import { generalConfig } from "@config"

const dateMasks = {
    default: 'DD/MM/YYYY - HH:mm:ss',
    onlyDate: 'DD/MM/YYYY',
    onlyDateFileName: 'YYYY-MM-DD' 
}

/**
 * Format a date object to a templated string using the [date-and-time](https://www.npmjs.com/package/date-and-time) library.
 * @param date 
 * @param mask - template for the date format
 * @returns 
 */
export const formatDate = (date: Date, mask: keyof typeof dateMasks = 'default') => {

    const convertedDate = convertTZ(date, generalConfig.timezone)
    return dateformat.format(convertedDate, dateMasks[mask], true)
}