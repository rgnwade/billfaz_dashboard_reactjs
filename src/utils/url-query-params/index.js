import qs from 'qs'

export const generateUrlQueryParams = (params, withoutPage) => {
  const paramsClone = withoutPage ? { ...params } : { ...params, page: params.page || 1 }
  const keys = Object.keys(params)
  keys.map((key) => {
    if (!params[key]) delete paramsClone[key]
    return key
  })
  return qs.stringify(paramsClone)
}

export const parseUrlQueryParams = (query) => {
  const parsedQuery = qs.parse(query.replace('?', ''))
  return parsedQuery.page ? { ...parsedQuery, page: parseInt(parsedQuery.page, 10) } : { ...parsedQuery, page: 1 }
}

export const compareParams = (prevProps, currProps, stateParams) => {
  const prevParams = parseUrlQueryParams(prevProps.search)
  const currParams = parseUrlQueryParams(currProps.search)
  const prevKeys = Object.keys(prevParams)
  const currKeys = Object.keys(currParams)
  const stateKeys = Object.keys(stateParams)
  const keys = [...new Set([].concat(prevKeys, currKeys, stateKeys))]
  const isDifferent = keys.map((key) => {
    const valPrev = prevParams[key] || ''
    const valCurr = currParams[key] || ''
    const valState = stateParams[key] || ''
    return valPrev !== valCurr && valCurr !== valState
  }).reduce(((prev, curr) => prev || curr), false)
  return isDifferent
}
