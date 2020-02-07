import axios from 'axios'

export default ({ url, config }) => {
  const endpoint = 'v1/user'
  return {
    get: () => axios.get(`${url}${endpoint}`, config()),
    list: filter => axios.get(`${url}${endpoint}/list`, { ...config(), params: { filter } }),
    create: data => axios.post(`${url}${endpoint}`, data, config()),
    createApiKey: () => axios.post(`${url}${endpoint}/key`, {}, config()),
    delete: id => axios.delete(`${url}${endpoint}/${id}`, config()),
    changePassword: data => axios.patch(`${url}${endpoint}/changePassword`, data, config()),
    logout: () => axios.get(`${url}${endpoint}/logout`, config()),
  }
}
