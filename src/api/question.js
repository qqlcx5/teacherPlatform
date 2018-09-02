import fetch from '@/utils/fetch'

export default {
  list: {
    get(params) {
      return fetch.post('/item/list', params)
    }
  },
  getQuDetail (itemId) {
    return fetch.get(`/item/${itemId}`)
  }
}
