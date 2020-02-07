import axios from 'axios'

export default ({ url, config }) => {
  const endpoint = 'v1/permission'
  return {
    get: () => axios.get(`${url}${endpoint}`, config()),
  }
}
