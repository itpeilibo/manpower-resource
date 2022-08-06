import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Print from 'vue-print-nb'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import Components from '@/components/index'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/components/ImageUpload'
import '@/components/index'
import * as filters from '@/filters/index'
// 全局注册,提供一个全局指令 v-print
// v-print= 'dom元素选择器'
Vue.use(Print)
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册全局的过滤器
  Vue.filter(key, filters[key])
})
// 一次性注册所有的指令
import * as directives from '@/directives/index'

for (const key in directives) {
  // 注册指令
  Vue.directive(key, directives[key])
}

Vue.use(Components)
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
