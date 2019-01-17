import axios from 'axios'

export default ({ url, config }) => {
  const endpoint = 'v1/user'
  return {
    logout: () => axios.get(`${url}${endpoint}/logout`, config()),
  }
}
