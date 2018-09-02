import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import NProgress from 'nprogress'
import store from '@/store'
import { user } from '@/api'
Vue.use(Router)

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.state.permission.routes.length === 0) {
    user.getRoutes().then(res => {
      store.dispatch('GenerateRoutes', res.data).then(res => {
        router.addRoutes(store.state.permission.routes)
        next({ ...to })
      })
    }).catch(() => {
      NProgress.done()
    })
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  NProgress.done()
})

export default router
