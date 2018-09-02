import * as types from '../mutation-types'
import { user, paper } from '@/api'
import { Message } from 'element-ui'
const state = {
  userName: '',
  userSgr: {},
  quCart: []  // 试题篮
}

const actions = {
  async getUserSgr({ commit }) {
    try {
      let res = await user.userSgr.get()
      commit(types.SET_USERSGR, res.data)
      return res.message
    } catch (err) {
      return err
    }
  },
  async updateUserSgr({ dispatch, commit, getters }, params) {
    try {
      let res = await user.userSgr.put(params)
      commit(types.SET_USERSGR, params)
      return res
    } catch (err) {
      return err
    }
  },
  // 获取试题篮数据
  async getQuCart({commit}) {
    try {
      let res = await paper.getPaperBasketIds()
      if (!res.success) throw res.message
      commit(types.SET_QU_CART, res.data.itemIds || [])
    } catch (e) {
      Message.error(e)
    }
  },
  // 将试题加入到用户的试题篮中
  async joinQuCart({commit}, id) {
    try {
      let res = await paper.joinItemBasket(id)
      if (res.success && res.data) {
        commit(types.SET_QU_CART, res.data.itemIds || [])
      } else {
        throw res.message
      }
    } catch (e) {
      Message.error(e)
    }
  },
  // 从用户的试题篮中移除
  async appearQuCart({commit}, id) {
    try {
      let res = await paper.appearItemBasket(id)
      if (!res.success) throw res.message
      commit(types.SET_QU_CART, res.data.itemIds || [])
    } catch (e) {
      Message.error(e)
    }
  },
  // 清空试题篮
  async clearQuCart({commit}) {
    try {
      let res = await paper.clearPaperBasket()
      if (res.success) throw res.message
      commit(types.SET_QU_CART, res.data.itemIds || [])
    } catch (e) {
      Message.error(e)
    }
  },
  // 变更用户的试题蓝数据
  async updateQuCart({commit}, data) {
    commit(types.SET_QU_CART, data)
  }
}

const mutations = {
  [types.SET_USERSGR](state, data) {
    state.userSgr = { ...state.userSgr, ...data }
  },
  [types.JOIN_QU_CART](state, id) {
    state.quCart.push(id)
  },
  [types.APPEAR_QU_CART](state, id) {
    const idx = state.quCart.findIndex(v => v === id)
    idx > -1 && state.quCart.splice(idx, 1)
  },
  [types.SET_QU_CART](state, arr) {
    state.quCart = arr
  }
}

export default {
  state,
  actions,
  mutations
}
