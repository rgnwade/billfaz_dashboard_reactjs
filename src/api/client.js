import axios from 'axios'

export default ({ url, config, defaultParams }) => {
  const endpoint = 'v1/clients'
  return {
    get: params => axios.get(`${url}${endpoint}/list`, { ...config(), params: { ...defaultParams, ...params } }),
    getAll: () => axios.get(`${url}${endpoint}`, config()),
    changeEmail: data => axios.patch(`${url}${endpoint}/changeEmail`, data, config()),
    create: data => axios.post(`${url}${endpoint}`, data, config()),
  }
}
