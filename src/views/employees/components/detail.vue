<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="formRef"
              label-width="120px"
              :rules="rules"
              style="margin-left: 120px; margin-top:30px"
              :model="formData"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:40%" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="formData.password2" style="width:40%" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <keep-alive>
              <component :is="UserInfo" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info'
import jobInfo from '@/views/employees/components/job-info'
export default {
  name: 'Detail',
  components: { UserInfo, jobInfo },
  data() {
    return {
      UserInfo: 'UserInfo',
      jobInfo: 'jobInfo',
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '输入名字不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '输入密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 获取用户信息
    // console.log(this.$route.params.id)
    this.getUserInfo()
  },
  methods: {
    //  根据路由携带的id参数获取用户的基本信息
    async getUserInfo() {
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    async updateUserInfo() {
      await this.$refs.formRef.validate()
      try {
        await saveUserDetailById({
          ...this.formData,
          // 密码是表单里面的字段
          password: this.formData.password2
        })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message.error(e.message || '更新失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
