import axios from 'axios'

import { PUBLIC_URL } from '../config/url'
import { cookies } from '../utils/cookies'
import { CONFIG_COOKIES } from '../config/cookies'
import Auth from './auth'
import Order from './order'
import Deposit from './deposit'
import Product from './product'
import Client from './client'
import Provider from './provider'
import Permission from './permission'
import User from './user'

export const url = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL_PROD
  : process.env.REACT_APP_API_URL_DEV

export const configApi = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookies.get(CONFIG_COOKIES.TOKEN)}`,
  },
})

// Destroy access
export const BACK_TO_LOGIN = async () => {
  await cookies.remove(CONFIG_COOKIES.TOKEN)
  await cookies.remove(CONFIG_COOKIES.ROLE)
  await cookies.remove(CONFIG_COOKIES.USERNAME)
  await cookies.remove(CONFIG_COOKIES.PERMISSION)
  window.location.href = PUBLIC_URL || '/'
}

// For handle 401 status
axios.interceptors.response.use(
  response => response,
  (err) => {
    if (
      err.response
      && err.response.status === 401
      // && err.response.data.code !== 'ClientUnauthorizedError'
      && !err.request.responseURL.includes('v1/auth')
    ) {
      BACK_TO_LOGIN()
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
