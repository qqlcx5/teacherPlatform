// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '@/directive'
import Sortable from 'vue-sortable'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Sortable)

// 生产环境下不引入mockjs
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

Vue.prototype.bus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
