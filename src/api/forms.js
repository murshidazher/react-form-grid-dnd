import client from './client'

const endpoint = '/data'

const getForm = (uri) => client.get(`${endpoint + uri}`)

export default {
  getForm,
}
