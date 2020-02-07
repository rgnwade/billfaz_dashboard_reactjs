export const getErrorMessage = err => (
  (err.response && err.response.data && err.response.data.message) || ''
)

export const getErrorField = err => (
  err.response && err.response.data
  && err.response.data.fields && err.response.data.fields.length > 0
    ? `${err.response.data.fields[0].field} - ${err.response.data.fields[0].message}` : ''
)

export const getError = (err) => {
  const dataErr = err.response && err.response.data
  const fieldError = getErrorField(err)
  return (typeof (dataErr) === 'string' ? err.response.data : `${getErrorMessage(err)} ${fieldError ? `: ${fieldError}` : ''}`)
}
