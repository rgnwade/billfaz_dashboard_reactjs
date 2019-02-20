import axios from 'axios'
import Cookies from 'universal-cookie'

import { CONFIG_COOKIES } from '../config/cookies'
import Auth from './auth'
import Order from './order'
import Deposit from './deposit'
import Product from './product'
import Client from './client'
import Provider from './provider'
import Permission from './permission'
import User from './user'
import MENU from '../config/menu'

export const url = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL_PROD
  : process.env.REACT_APP_API_URL_DEV

export const configApi = ({ contentType } = {}) => {
  const cookies = new Cookies()
  return {
    headers: {
      'Content-Type': contentType || 'application/json',
      Authorization: `Bearer ${cookies.get(CONFIG_COOKIES.TOKEN)}`,
    },
  }
}

// Destroy access
export const BACK_TO_LOGIN = async (isExpired = false) => {
  const cookies = new Cookies()
  await cookies.remove(CONFIG_COOKIES.TOKEN)
  if (cookies.get(CONFIG_COOKIES.TOKEN)) {
    document.cookie = `${CONFIG_COOKIES.TOKEN}=;`
  }
  await cookies.remove(CONFIG_COOKIES.ROLE)
  await cookies.remove(CONFIG_COOKIES.USERNAME)
  await cookies.remove(CONFIG_COOKIES.PERMISSION)
  await cookies.remove(CONFIG_COOKIES.ROLE_NAME)
  await cookies.remove(CONFIG_COOKIES.EMAIL)
  window.location.href = isExpired ? `${MENU.LOGIN}?isExpired=true` : MENU.HOME
}

// For handle 401 status
axios.interceptors.response.use(
  response => response,
  (err) => {
    if (
      err.response
      && (
        (err.response.status === 401 && !err.request.responseURL.includes('v1/auth'))
        || (err.response.status === 403 && err.response.data.code === 'ClientUnauthorizedError')
      )
    ) {
      BACK_TO_LOGIN(true)
    }
    return Promise.reject(err)
  },
)

const params = { url, config: configApi, defaultParams: { limit: 10 } }
export const AuthApi = Auth(params)
export const OrderApi = Order(params)
export const DepositApi = Deposit(params)
export const ProductApi = Product(params)
export const ClientApi = Client(params)
export const ProviderApi = Provider(params)
export const PermissionApi = Permission(params)
export const UserApi = User(params)
