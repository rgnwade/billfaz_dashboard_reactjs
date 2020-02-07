import { getCookies } from '../cookies'
import { CONFIG_COOKIES } from '../../config/cookies'

const getRoleFromCookies = () => {
  const permissions = getCookies(CONFIG_COOKIES.PERMISSION)
  return permissions || []
}

export const hasAccess = (roleItem) => {
  const permissions = getRoleFromCookies()
  return permissions.includes(roleItem)
}
