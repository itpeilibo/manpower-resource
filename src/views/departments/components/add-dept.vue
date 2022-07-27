
<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployee">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departs'
import { getEmployeeSimple } from '@/api/employees.js'
export default {
  name: 'AddDept',
  props: {
    //   用来控制窗体是否显示或者隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    //  当前操作的节点
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // this
    // function ==> 谁调用指向谁
    // 剪头函数 ==> 定义位置的this ==> vue组件实例
    const checkName = async(rules, value, callback) => {
      // 找出当前点击的部门的所有子部门
      // 首先获取最新的组织架构数据 请求所有数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 同级数据
        // isRepeat = depts.filter(item => item.id !== this.treeNode.id && item.pid === this.treeNode.pid).some(item => item.name === value)
        isRepeat = depts.filter(item => item.id !== this.treeNode.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        // 同级部门的名称不能相同
        // treeNode当前点击的节点
        // some方法只要有一个满足条件就返回true：查看是否有满足条件的元素
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`${value}部门名称重复了`)) : callback()
    }
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkCode = async(rules, value, callback) => {
      const { depts } = await getDepartments()
      // 判断逻辑
      let isRepeat = false
      // 所有数据的code都不能相同

      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.treeNode.id && item.code === value)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      isRepeat ? callback(new Error(`${value}部门编码重复了`)) : callback()
    }
    return {
      peoples: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门名称1-50个字符'
          },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码1-50个字符'
          },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空',
            trigger: 'blur'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 3000,
            message: '部门编码1-3000个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    // 获取当前部门详情
    async getDeptsDetail(id) {
      const data = await getDepartDetail(id)
      //  拿到数据赋值给formData
      this.formData = data
    },
    async getEmployee() {
      // 获取负责人数据
      this.peoples = await getEmployeeSimple()
    },
    async submit() {
      //  校验表单
      await this.$refs.addForm.validate()
      // 有id  编辑功能
      if (this.formData.id) {
        // 编辑
        await updateDepartments(this.formData)
        // // 进行成功的提示
        // this.$message.success('编辑成功')
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.treeNode.id// 当前点击的数据的id
        })
      }
      this.$message.success(`${this.showTitle}成功`)

      // 通过.sync提供的自定义事件修改父组件属性
      this.$emit('update:showDialog', false)
      // 重新拉取列表数据 >> 通知父组件执行
      this.$emit('getDept')
      this.close()
    },
    close() {
      // 手动重置数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 表单数据需要重置
      this.$refs.addForm.resetFields()
      // 通过.sync提供的自定义事件修改父组件属性
      this.$emit('update:showDialog', false)
      // 非表单中的数据不能重置
    }
  }
//  form ==> :model  :rules
//  form-item ==> prop
//  input ==> v-model
}
</script>

