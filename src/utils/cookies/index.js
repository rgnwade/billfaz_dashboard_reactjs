import Cookies from 'universal-cookie'

export const cookies = new Cookies()

export const getCookies = name => cookies.get(name)
