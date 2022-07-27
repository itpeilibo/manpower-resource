import Cookies from 'js-cookie'
// cookie
// 怎么操作cookie
// 借助第三方库
// document.cookie = 'key=value&key=value'
// localStorage.setItem('')
const TokenKey = 'hrsass_token' // token存储到本地存储 >> key
const timeKey = 'hrsaas-timestamp-key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
