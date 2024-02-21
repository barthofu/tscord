import dayjs from 'dayjs'
import dayjsTimeZone from 'dayjs/plugin/timezone'
import dayjsUTC from 'dayjs/plugin/utc'

import { generalConfig } from '@/configs'

dayjs.extend(dayjsUTC)
dayjs.extend(dayjsTimeZone)

dayjs.tz.setDefault(generalConfig.timezone)

export const datejs = dayjs.tz

const dateMasks = {
	default: 'DD/MM/YYYY - HH:mm:ss',
	onlyDate: 'DD/MM/YYYY',
	onlyDateFileName: 'YYYY-MM-DD',
}

/**
 * Format a date object to a templated string using the [date-and-time](https://www.npmjs.com/package/date-and-time) library.
 * @param date
 * @param mask - template for the date format
 * @returns formatted date
 */
export function formatDate(date: Date, mask: keyof typeof dateMasks = 'default') {
	return datejs(date).format(dateMasks[mask])
}

export function timeAgo(date: Date) {
	return dayjs(date).fromNow()
}
