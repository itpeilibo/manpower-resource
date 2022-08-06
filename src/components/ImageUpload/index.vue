<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list.sync="fileList"
      :limit="1"
      :class="{completed: isCompleted}"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :text-inside="true" :stroke-width="26" :percentage="percentage" style="width: 200px" />
    <!--    <el-progress :percentage="percentage" />-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDqWxCE4g3FF0b0YsxnQq2yiFZeT5WkjTz',
  SecretKey: 'MSIxQhkaDdoomeHqCJBpEQQCj13qOhkX'
})
console.log(cos)
export default {
  name: 'ImageUpload',
  data() {
    return {
      showPercent: false,
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      // 指定默认图片
      fileList: [
        { url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202111%2F26%2F20211126105820_273b6.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273511&t=fbbf4c3a52c0606d8ac303c7f9df97bf' }
      ]
    }
  },
  // 判断是否有图片
  computed: {
    isCompleted() {
      return this.fileList.length >= 1
    }
  },
  methods: {

    changeFile(file, fileList) {
      // fileList最终的文件列表
      // 直接push可能导致同一个文件被重复添加
      console.log(fileList)
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // file
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      // file上传的文件对象
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 判断上传的文件类型是否在预定的范围以内
      if (!types.includes(file.type)) {
        // 说明满足条件
        this.$message.error('文件类型不匹配')
        return false
      }

      // 判断文件的大小
      const maxSize = 5 * 1024 * 1024 // 1m = 1024kb 1kb = 1024b
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }
      this.showPercent = true
    },
    upload(params) {
      const { file } = params
      // console.log(file)
      // 开始文件上传到腾讯云对象存储
      // 如果上传的文件对象不存在,终止代码执行
      if (!file) return
      cos.putObject({
        Bucket: 'itpeilibo-1313136735', // 存储桶
        Region: 'ap-hongkong', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percentage = percent * 100
        }
      }, (err, data) => {
        // console.log(data)
        if (err) {
          this.$message.error(err?.message || '上传出错')
          return
        }
        // 替换url的时候，直接给最后一项替换
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            // 只有成功获取到了服务器端图片链接的时候,加一个标识
            // 目的：提交更新的时候，进行判断，如果当前文件对象里面没有upload属性,不进行提交
            item.upload = true
          }
        })
        // 上传成功了
        // 进度条关闭掉
        // 延时把进度条关掉 >> 看到动画效果
        setTimeout(() => {
          this.showPercent = false
          // 进度条清零
          this.percentage = 0
        }, 1500)
      })
    }
  }
}
</script>
<style scoped lang="scss">
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
