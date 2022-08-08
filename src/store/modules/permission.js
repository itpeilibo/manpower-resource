// 引入静态路由表
import { asyncRoutes, constantRoutes } from '@/router'
const state = {
  // 存储了当前用户所拥有的所有权限
  routes: constantRoutes
}

const mutations = {
  // newRoutes动态路由
  // 请求到个人信息的时候,动态路由和静态路由进行合并
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  /**
   * 当前用户拥有的路由权限列表
   * 路由的name
   * [
   * "employees"
   * 1: "permissions"
   * 2: "social_securitys"
   * 3: "approvals"
   * 4: "attendances"
   * 5: "salarys"
   * 6: "departments"
   * ]
   */
  filterRoutes(context, menus) {
    // 动态路由
    // 用户拥有的路由的name值
    // 筛选
    const resRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    console.log(resRoutes)
    context.commit('setRoutes', resRoutes)
    return resRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
