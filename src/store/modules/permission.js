import * as types from '../mutation-types'
const _import = require('@/utils/_import')

const state = {
  permission: [],
  routes: []
}

const mutations = {
  [types.SET_ROUTES](state, routes) {
    state.routes = routes
  }
}

function setRoutesComponent (routes) {
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i]
    if (route.componentPath) {
      route.component = _import(route.componentPath)
      delete route.componentPath
    }
    if (route.children) {
      setRoutesComponent(route.children)
    }
  }
}

const actions = {
  GenerateRoutes({ commit }, data) {
    return new Promise((resolve) => {
      let routes = data
      setRoutesComponent(routes)
      commit('SET_ROUTES', routes)
      resolve()
    })
  }
}

export default {
  state,
  actions,
  mutations
}
