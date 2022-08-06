<template>
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
import UploadExcel from '@/components/UploadExcel/UploadExcel'
import { importEmployee } from '@/api/employees'
const userRelations = {
  '入职日期': 'timeOfEntry',
  '手机号': 'mobile',
  '姓名': 'username',
  '转正日期': 'correctionTime',
  '工号': 'workNumber'
}

export default {
  // name:'Import'
  components: { UploadExcel },
  data() {
    return {
    }
  },
  methods: {
    async onSuccess({ results }) {
      // console.log(results)
      // 处理数据
      const resArr = results.map(item => {
        // 数据对象的中文key >> 英文的key
        const obj = {}

        for (const itemKey in item) {
          if (['timeOfEntry', 'correctionTime'] === userRelations[itemKey]) {
            obj[userRelations[itemKey]] = new Date(this.formatDate(item[itemKey], '/'))
          } else {
            obj[userRelations[itemKey]] = item[itemKey]
          }
        }
        return obj
      })
      // console.log(resArr)
      await importEmployee(resArr)
      this.$message.success('上传成功')
      this.$router.push('/employees')
      // excel里面的内容
      // excel中的时间是一个数字，需要调用此方法进行处理 -> 直接复制
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

