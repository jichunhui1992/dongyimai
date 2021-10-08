// // 创建 axios 实例
// // 创建请求拦截器
// // 创建响应拦截器
// // import vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
// import { Router } from 'express'

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
// 其他地方可能不用这个url

const instance = axios.create({
//   baseURL: '',
  baseURL,
  timeout: 5000

})
instance.interceptors.request.use(
  (config) => {
    const { profile } = store.state.user
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  }, (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use((res) => {
  return res.data// 过滤无用数据
}, (err) => {
  if (err.response && err.response.status === 401) {
    //   token清除信息
    store.commit('user/setUser', {})
    // 跳转登录页面并需要传参，传参为当前登录地址
    // 如果在组件里找路由地址$router.path没有路由后的参数
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath())// 避免因参数后面的字符影响路径的的传播浏览器是可以识别的

    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

export const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    // params: submitData || {}
    // data
    [method.toLowerCase === 'get' ? 'params' : 'data']: submitData // 动态插入key，写js表达式，执行结果当做key
  })
}
