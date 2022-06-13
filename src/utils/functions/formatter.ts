import dateformat from "date-and-time"

import { convertTZ } from "./converter"

import { generalConfig } from "@configs"

const dateMasks = {
    default: 'DD/MM/YYYY - HH:mm:ss',
    onlyDate: 'DD/MM/YYYY',
}

export const formatDate = (date: Date, mask: keyof typeof dateMasks = 'default') => {

    const convertedDate = convertTZ(date, generalConfig.timezone)
    return dateformat.format(convertedDate, dateMasks[mask], true)
}