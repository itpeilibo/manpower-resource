// 状态

// 引入接口的方法
import { getToken, removeToken, setToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken()
}
// 修改状态
const mutations = {
  // 修改state里面的数据
  // 设置token
  // 1.vuex
  // 2.cookie
  setToken(state, token) {
    state.token = token
    setToken(token) // 本地存储的设置token的方法 >> auth.js中引入
  },
  // 移除token
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
// 执行异步
const actions = {
  // 登录请求 >> 拿到数据 >> 在mutations里面修改
  async login(context, data) {
    //  调用登录的请求接口
    const res = await login(data)
    //  打印接口调用的结果
    console.log(res)

    context.commit('setToken', res)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
