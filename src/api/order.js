import axios from 'axios'

export default ({ url, config, defaultParams }) => {
  const endpoint = 'v1/orders'
  return {
    get: params => axios.get(`${url}${endpoint}`, { ...config(), params: { ...defaultParams, ...params } }),
    getOne: id => axios.get(`${url}${endpoint}/${id}`, config()),
    advice: (id, data) => axios.post(`${url}${endpoint}/${id}/retry`, data, config()),
    changeStatus: (id, data) => axios.post(`${url}${endpoint}/${id}/setIssuedStatus`, data, config()),
    sendReport: data => axios.post(`${url}${endpoint}/resendCallback`, data, config()),
    getTotal: () => axios.get(`${url}${endpoint}/total`, config()),
    refund: (id, data) => axios.post(`${url}${endpoint}/${id}/refund`, data, config()),
    export: data => axios.post(`${url}${endpoint}/export`, data, config()),
  }
}
