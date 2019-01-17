const convertToString = (number) => {
  let convertedNumber = number
  if (typeof (number) === 'number') {
    convertedNumber = number.toString()
  }
  return convertedNumber
}

export const numberToMoney = (number = '0') => convertToString(number) && `Rp. ${parseInt(convertToString(number), 10).toLocaleString().replace(/,/g, '.')}`
export const numberToMoneyNoRP = (number = '0') => convertToString(number) && `${parseInt(convertToString(number), 10).toLocaleString().replace(/,/g, '.')}`
export const numberToMoneyWithoutPrefix = (number = '0') => convertToString(number) && `${parseInt(convertToString(number), 10).toLocaleString().replace(/,/g, '.')}`
export const moneyToNumber = (money = '0') => parseInt(money.replace(/\./g, '').replace('Rp', '').trim(), 10)

export const inputMoneyHandler = (value) => {
  const val = Number.isNaN(parseInt(value, 10))
    ? moneyToNumber(value)
    : value
  return val || 0
}
