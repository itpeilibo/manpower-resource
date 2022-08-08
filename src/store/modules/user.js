// 状态
// 引入接口的方法
import { getToken, removeToken, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
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
  },
  // 清空
  removeUserInfo(state) {
    state.userInfo = {}
  },
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }
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
  },
  // 获取用户资料的action
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // 存储到vuex
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return {
      ...res,
      ...baseInfo
    }
    // return baseResult
  },
  // 退出登录
  logout(context) {
    // 清除token用户信息
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置路由匹配信息
    resetRouter()
    // context是根节点的上下文
    // vuex里面的路由表置空
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
