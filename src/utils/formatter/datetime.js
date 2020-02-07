import dayjs from 'dayjs'
// import id from 'dayjs/locale/id'

// dayjs.locale(id)

const timezones = {
  7: 'WIB',
  8: 'WITA',
  9: 'WIT',
}

const commonDateFormat = 'DD MMM YYYY'
const commonDateTimeFormat = 'DD MMM YYYY, HH:mm'

export const getTimezoneNew = () => {
  const date = new Date()
  return date.getTimezoneOffset() / 60
}

export const datetimeToLocal = datetime => datetime
  && `${dayjs(datetime).format(commonDateTimeFormat)}`

export const datetimeToLocalDetail = datetime => datetime
  && `${dayjs(datetime).format('dddd')}, ${dayjs(datetime).format(commonDateFormat)} ${dayjs(datetime).format('HH:mm')}`

export const dateToLocal = datetime => datetime
  && `${dayjs(datetime).format(commonDateFormat)}`

export const dateToLocalDetail = datetime => datetime
  && `${dayjs(datetime).format('dddd')}, ${dayjs(datetime).format(commonDateFormat)}`

export const monthToLocal = month => month && `${dayjs(month, 'YYYY-MM').format('MMMM YYYY')}`

export const customFormat = (date, format) => dayjs(date).format(format)

export const getTimezoneName = timezone => timezones[timezone]
export const getTimezone = (datetime) => {
  const defaultTimezone = 7
  if (!datetime) return defaultTimezone
  const timezone = dayjs(datetime)
    .format('Z')
    .substring(1, 3)
  return parseInt(timezone, 10) || defaultTimezone
}

export const calculateTimezoneName = datetime => getTimezoneName(getTimezone(datetime))

export const dateTimeToLocalTime = datetime => datetime
  && `${customFormat(datetime, 'HH:mm')} ${calculateTimezoneName(datetime)}`
