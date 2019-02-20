import axios from 'axios'

export default ({ url, config, defaultParams }) => {
  const endpoint = 'v1/depositevents'
  return {
    get: (params) => axios.get(`${url}${endpoint}`, { ...config(), params: { ...defaultParams, ...params } }),
    topup: (type, id, data) => axios.post(`${url}${endpoint}/${type}/${id}/topup`, data, config({ contentType: 'multipart/form-data' })),
    exportData : data => axios.post(`${url}${endpoint}/export`, data, config()),
  }
}
