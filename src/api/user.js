import axios from 'axios'

export default ({ url, config }) => {
  const endpoint = 'v1/user'
  return {
    get: () => axios.get(`${url}${endpoint}`, config()),
    list: filter => axios.get(`${url}${endpoint}/list`, { ...config(), params: { filter }}),
    logout: () => axios.get(`${url}${endpoint}/logout`, config()),
  }
}
