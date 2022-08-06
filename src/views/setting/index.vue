<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="first">
            <el-row>
              <el-col>
                <el-button size="small" icon="el-icon-plus" type="primary" style="margin: 5px 0 30px 0" @click="showDialog = true">新增角色</el-button>
                <el-table
                  border
                  :data="list"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="180"
                  />
                  <el-table-column
                    prop="name"
                    label="角色名称"
                    width="180"
                  />
                  <el-table-column
                    prop="description"
                    label="描述"
                  />
                  <el-table-column
                    label="操作"
                  >
                    <template v-slot="{row}">
                      <el-button size="small" type="success">分配权限</el-button>
                      <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                      <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row style="margin-top:20px" type="flex" justify="center">
                  <el-pagination
                    :page-size="page.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :page-sizes="[1, 2, 5, 10]"
                    :current-page="page.page"
                    background
                    @current-change="changeCurrent"
                  >
                    />
                  </el-pagination></el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            />
            <el-form ref="form" :model="formData" label-width="80px" style="margin-top: 50px" disabled>
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

      </el-card>
      <!--  编辑弹框   -->
      <el-dialog :title="`${this.roleFormData.id ? '编辑角色' : '新增角色'}`" :visible.sync="showDialog" @close="close">
        <el-form ref="roleForm" :model="roleFormData" :rules="roleRules" label-width="100px">
          <el-form-item label="角色" prop="name">
            <el-input v-model="roleFormData.name" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="roleFormData.description" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showDialog=false">取消</el-button>
          <el-button type="primary" @click="btnOK">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deleteRole, getCompanyInfo, getRoleDetail, getRoleList } from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'first',
      form: '',
      list: [],
      formData: {

      },
      total: 0, // 记录总数
      showDialog: false,
      roleFormData: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }]
      },
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10
      }
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  computed: {
    ...mapGetters(['companyId'])

  },
  methods: {
    handleClick() {

    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      console.log(rows)
      this.list = rows
      this.total = total
    },
    changeCurrent(page) {
      // 切换之后的最新页码
      console.log(page)
      this.page.page = page
      this.getRoleList()
    },
    async getCompanyInfo() {
      // 使用公司id
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
    },
    async del(id) {
      await this.$confirm('确认删除')
      const len = this.list.length
      await deleteRole(id)
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      // 重新获取数据
      // 成功的提示
      this.$message.success('删除成功')
      // 重新拉取列表数据
      await this.getRoleList()
    },
    // 数据回显 开启弹框
    async editRole(id) {
      this.roleFormData = await getRoleDetail(id)
      this.showDialog = true
    },
    // 点击x号关闭弹框
    close() {
      this.showDialog = false
      // 重置默认数据
      this.$refs.roleForm.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    // 点击修改
    async btnOK() {
      // 表单校验

    }
  }
}
</script>

<style lang="scss" scoped>
div {
  justify-items: center;
}
</style>

