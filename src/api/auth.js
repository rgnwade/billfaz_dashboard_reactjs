import axios from 'axios'

export default ({ url, config }) => {
  const endpoint = 'v1/auth'
  return {
    login: data => axios.post(`${url}${endpoint}`, data, config()),
    test: () => axios.get(`${url}${endpoint}/test`, config()),
  }
}
