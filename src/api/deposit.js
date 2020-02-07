import axios from 'axios'

export default ({ url, config, defaultParams }) => {
  const endpoint = 'v1/depositevents'
  const endpointClient = 'v1/deposits/client'
  return {
    get: (params,type) => axios.get(`${url}${endpoint}`, { ...config(), params: { ...defaultParams, ...params } }),
    getBalance: () => axios.get(`${url}${endpointClient}/balance`, config()),
    topup: (type, id, data) => axios.post(`${url}${endpoint}/${type}/${id}/topup`, data, config({ contentType: 'multipart/form-data' })),
    exportData : data => axios.post(`${url}${endpoint}/export`, data, config()),
  }
}
