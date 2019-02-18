import axios from 'axios'

export default ({ url, config }) => {
  const endpoint = 'v1/user'
  return {
    get: () => axios.get(`${url}${endpoint}`, config()),
    logout: () => axios.get(`${url}${endpoint}/logout`, config()),
  }
}
