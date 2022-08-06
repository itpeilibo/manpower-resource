import axios from "axios";
import store from "@/store";
import { Message } from "element-ui";
import { getTimeStamp } from "@/utils/auth";
import router from "@/router";
const timeOut = 6000000; // 定义超时时间
const request = axios.create({
  // baseURL:''
  baseURL: process.env.VUE_APP_BASE_API,
}); // 创建axios实例
function IsCheckTimeOut() {
  return Date.now() - getTimeStamp < timeOut;
}
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果token存在，请求的时候需要把token携带到请求头
    const token = store.getters.token;
    if (token) {
      // token携带到请求头
      if (IsCheckTimeOut()) {
        Message.error("登录超时了");
        store.dispatch("user/logout");
        router.push("/");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 配置项一定要return 否则返回undefined
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // console.log(response);
    // 解构从后端返回的数据和状态
    const {
      data: { success, data, message },
    } = response;
    // 判断
    if (success) {
      return data;
    }

    Message.error(message || "系统错误");

    return Promise.reject(message || "系统错误");
  },
  (error) => {
    if (error.response.status === 401) {
      // 退出登录
      store.dispatch("user/logout");
      router.push("/login");
    }
    Message.error(error.response?.data?.message || "系统错误");
    return Promise.reject(error);
  }
);

export default request; // 默认导出request请求
