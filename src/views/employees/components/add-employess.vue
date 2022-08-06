<template>
  <div>
    <el-dialog :visible="isshowAddEmployess" title="新增员工" @close="close">
      <!-- 表单 -->
      <el-form ref="resetFields" :model="formData" label-width="120px" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
            <el-option v-for="item in selectOptions" :key="item.id" :value="item.id" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <!--          <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" />-->
          <el-cascader v-model="formData.departmentName" style="width: 80%" :options="options" :props="{label:'name',value:'name', emitPath: false, checkStrictly: true} " @focus="getDepartments" />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
        </el-form-item>

      </el-form>
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="close">取消</el-button>
            <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { transListToTree } from '@/utils'
import { getDepartments } from '@/api/departments'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
export default {
  name: 'AddEmployess',
  props: {
    isshowAddEmployess: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectOptions: EmployeeEnum.hireType,
      options: [],
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  // mounted() {
  //   console.log(this.getDepartments())
  // },
  created() {
    this.getDepartments()
  },
  methods: {
    async btnOk() {
      // 校验表单
      this.$refs.resetFields.validate()
      // 接口的提交
      await addEmployee(this.formData)
      this.$message.success('新增成功')
      // 关闭弹层
      this.close()
      // 重新获取列表数据
      // 获取父组件的示例，直接调用辅助调用父组件的方法
      this.$parent.getEmpList()
    },
    async getDepartments() {
      const { depts } = await getDepartments()
      // 数组结构 >> 树形
      this.options = transListToTree(depts, '')
    },
    close() {
      // 关闭
      this.$emit('update:isshowAddEmployess', false)
      // 重置表单
      this.$refs.resetFields.resetFields()
      // 重置数据
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
    }
  }
}
</script>

<style scoped>

</style>
