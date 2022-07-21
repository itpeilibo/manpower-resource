import axios from 'axios'
import { Message } from 'element-ui'
const request = axios.create({
  // baseURL:''
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建axios实例

// 请求拦截器
request.interceptors.request.use()

// 响应拦截器
request.interceptors.response.use((response) => {
  // console.log(response);
  // 解构从后端返回的数据和状态
  const {
    data: { success, data, message }
  } = response
  // 判断
  if (success) {
    return data
  }

  Message.error(message || '系统错误')

  return Promise.reject(message || '系统错误')
})

export default request // 默认导出request请求
