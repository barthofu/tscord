import dateformat from "date-and-time"

import { convertTZ } from "./converter"
import config from "../../../config.json"

const dateMasks = {
    default: 'DD/MM/YYYY - HH:mm:ss',
    onlyDate: 'DD/MM/YYYY',
}

export const formatDate = (date: Date, mask: keyof typeof dateMasks = 'default') => {

    const convertedDate = convertTZ(date, config.timezone)
    return dateformat.format(convertedDate, dateMasks[mask], true)
}