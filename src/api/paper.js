import fetch from '@/utils/fetch'

export default {
  list: {
    get(params) {
      return fetch.post('/paper/list', params)
    }
  },
  detail: {
    get(id) {
      return fetch.get(`/paper/${id}`)
    }
  },
  // 获取我的试卷
  getMyPaperList(params) {
    return fetch.post('/paper/mine/list', params)
  },
  // 删除试卷
  delPaper(id) {
    return fetch.delete(`/paper/${id}`)
  },
  // 完成组卷
  completePaper(id) {
    return fetch.put(`/paper/${id}/complete`)
  },
  // 发布试卷
  publishPaper(id) {
    return fetch.put(`/paper/${id}/publish`)
  },
  // 分享试卷
  sharePaper(id) {
    return fetch.put(`/paper/${id}/share`)
  },
  // 获取试题篮IDS
  getPaperBasketIds() {
    return fetch.get('/item/basket/selected')
  },
  // 获取试题篮详情
  getPaperBasket() {
    return fetch.get(`/item/basket/detail`)
  },
  // 清空试题
  clearPaperBasket() {
    return fetch.delete(`/item/basket/empty`)
  },
  // 添加试题到试题篮
  joinItemBasket(id) {
    return fetch.post(`/item/basket/${id}`)
  },
  // 删除试题篮的试题
  appearItemBasket(id) {
    return fetch.delete(`/item/basket/${id}`)
  },
  // 试题篮排序
  sortItemBasket(id, params) {
    return fetch.put(`/paper/${id}/sort`, params)
  },
  // 修改题号分数
  updateItemScoreAndIdx(id, params) {
    return fetch.put(`/paper/${id}/showNoScore`, params)
  },
  // 修改试卷基本信息
  updatePaperBaseInfo(id, params) {
    return fetch.put(`/paper/${id}/paperBaseInfo`, params)
  },
  // 重置题号
  resetShowNo() {
    return fetch.put(`/item/basket/showNo/auto`)
  }
}
