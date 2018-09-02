// import Main from '@/pages/layout/Main.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "login" */ '@/pages/Login')
  }
]

export default routes
