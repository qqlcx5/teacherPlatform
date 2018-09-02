import axios from 'axios'
import { Message } from 'element-ui'
import { baseUrl } from '@/config/env.js'

const fetch = axios.create({
  baseURL: baseUrl,
  timeout: 10000
})

// 请求拦截
fetch.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  config.headers['Access-Control-Allow-Origin'] = '*'
  config.headers['Access-Control-Allow-Methods'] = '*'
  config.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
  config.headers['Access-Control-Allow-Headers'] = 'NCZ'
  config.headers['X-Router-Url'] = location.href
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
fetch.interceptors.response.use(res => {
  if (!res.data) {
    return Promise.reject(res)
  } else if (res.data.success) {
    return Promise.resolve(res.data)
  } else {
    // ajax报302错误时，直接跳转到登录页
    if (res.data.errorCode === 302) {
      window.location = res.data.data
      return
    }
    return Promise.reject(res.data)
  }
}, err => {
  Message.error(err)
  return Promise.reject(err)
})

export default fetch
