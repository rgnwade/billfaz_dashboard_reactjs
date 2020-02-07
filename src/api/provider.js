import axios from 'axios'

export default ({ url, config }) => {
  const endpoint = 'v1/providers'
  return {
    getAll: () => axios.get(`${url}${endpoint}`, config()),
  }
}
