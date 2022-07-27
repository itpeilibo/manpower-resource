// 定义自定义指令
// 解决图片报错问题

export const imgError = {
  inserted(el, options) {
    // el: 指令所绑定的元素，可以用来直接操作 DOM
    // console.log(el)
    // 如果图片赋值出错了，给他一个默认图片
    el.onerror = () => {
      el.src = options.value
    }
    // 如果图片赋值出错了，给他一个默认图片
  }
}

