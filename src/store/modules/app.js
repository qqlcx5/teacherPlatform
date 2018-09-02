/**
 * 主要用于存储页面的状态
 */
import * as types from '../mutation-types'
import { app } from '@/api'

const state = {
  // 需要进行缓存页面的name属性值(参见路由配置router.js)
  cachePage: [],
  // 科目年段地区选择器面板的基础数据
  sgrOptions: [],
  sidebarOpen: +window.localStorage.getItem('sidebar'),
  // 选择器的数据
  topicSelectOptions: [],
  manageUrl: '',
  // 双师教材课程步骤
  list: [
    {
      key: 'MAIN_TEACHING_CASE',
      value: '主师教案'
    },
    {
      key: 'STUDENT_TEXTBOOK',
      value: '学生教材'
    },
    {
      key: 'PREPARATION',
      value: '预习'
    },
    {
      key: 'CLASS_INTERACTION',
      value: '课中互动'
    },
    {
      key: 'POST_TEST',
      value: '课后测'
    },
    {
      key: 'ENTRANCE_TEST',
      value: '入门测'
    }
  ]
}

const mutations = {
  [types.SET_SGROPTIONS](state, options) {
    state.sgrOptions = options
  },
  [types.SET_TOPICSELECT](state, options) {
    state.topicSelectOptions = options
  },
  [types.TOGGLE_SIDEBAR](state) {
    state.sidebarOpen = state.sidebarOpen ? 0 : 1
    window.localStorage.setItem('sidebar', state.sidebarOpen)
  },
  [types.SET_MANAGE_URL](state, url) {
    state.manageUrl = url
  }
}

const actions = {
  async getSgrOptions({ commit }, dictType) {
    try {
      let res = await app.selector.get(dictType)
      commit(types.SET_SGROPTIONS, res.data)
      return res.message
    } catch (err) {
      return err
    }
  },
  // 获取选择器的数据
  async getTopicSelectorData({ commit }, type) {
    try {
      let res = await app.selector.get(type)
      commit(types.SET_TOPICSELECT, res.data)
      return res.message
    } catch (err) {
      return err
    }
  },
  async getManageUrl({ commit }) {
    try {
      let res = await app.getManageUrl()
      commit(types.SET_MANAGE_URL, res.data)
    } catch (err) {
      return err
    }
  }
}

export default {
  state,
  mutations,
  actions
}
