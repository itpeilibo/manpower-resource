import ToolBar from '@/components/ToolBar'
import ImageUpload from '@/components/ImageUpload'
// 对象
export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(ImageUpload.name, ImageUpload)
  }
}
// 函数
// export default function(Vue) {
//   Vue.component(ToolBar.name,ToolBar)
// }

