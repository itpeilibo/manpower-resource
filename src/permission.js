// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const loginPath = '/login'
const notFoundPath = '/404'
const whiteList = [loginPath, notFoundPath] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  //  首先判断有无token
  const token = store.getters.token
  if (token) {
    //   如果有token 继续判断是不是去登录页
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === loginPath) {
      //  表示去的是登录页
      next('/') // 跳到主页
    } else {
      // 白名单的界面(不需要权限)
      // 需要权限的界面
      next() // 直接放行
    }
  } else {
    // 判断是否去白名单界面 如果没有token /login
    if (whiteList.includes(to.path)) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next(loginPath) // 跳到登录页
    }
  }
})
// 后置守卫 路由跳转完成以后 >> 关闭进度条
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
