import fetch from '@/utils/fetch'

export default {
  // 提交纠错信息
  createCorrectInfo(params) {
    return fetch.post('/item/correct', params)
  },
  // 获取纠错列表
  getCorrectList(params) {
    return fetch.post(`/item/correct/page`, params)
  },
  // 获取单个试题纠错信息
  getCorrectDetail(itemCorrectId) {
    return fetch.get(`/item/correct/${itemCorrectId}`)
  },
  // 撤回纠错
  unDoCorrect(itemCorrectId) {
    return fetch.put(`/item/correct/${itemCorrectId}/cancel`)
  }
}
