import axios from 'axios'

export default ({ url, config, defaultParams }) => {
  const endpoint = 'v1/products/client'
  const endpointClientProducts = 'v1/clientproducts'
  return {
    // products
    get: params => axios.get(`${url}${endpoint}`, { ...config(), params: { ...defaultParams, ...params } }),
    getOne: id => axios.get(`${url}${endpoint}/${id}`, config()),
    update: (id, data) => axios.post(`${url}${endpoint}/${id}/update`, data, config()),
    getAvailableProducts: clientId => axios.get(`${url}${endpoint}/available?clientId=${clientId}`, config()),
    // client products
    getClientProducts: params => axios.get(`${url}${endpoint}/client`, { ...config(), params: { ...defaultParams, ...params } }),
    getClientProductHistories: params => axios.get(`${url}${endpointClientProducts}/history`, { ...config(), params: { ...defaultParams, ...params } }),
    getClientProductHistoriesByProduct: (clientId, productId) => axios.get(`${url}${endpointClientProducts}/history`, { ...config(), params: { clientId, productId } }),
    getClientProduct: (clientId, id) => axios.get(`${url}${endpointClientProducts}/${clientId}/${id}`, config()),
    updateClientProductStatus: data => axios.post(`${url}${endpointClientProducts}/active`, data, config()),
    createClientProduct: data => axios.post(`${url}${endpointClientProducts}/create`, data, config()),
    updateClientProduct: (id, data) => axios.post(`${url}${endpointClientProducts}/${id}/update`, data, config()),
    clientProductApproval: (id, data) => axios.post(`${url}${endpointClientProducts}/${id}/approval`, data, config()),
  }
}
