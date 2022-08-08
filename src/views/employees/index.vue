<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共50条数据</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="mini" type="warning" @click="isshowAddEmployess=true">新增员工</el-button>
        </template>
      </ToolBar>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <el-row type="flex" justify="center">
                <el-avatar style="width: 80px" hidden:80px :src="row.staffPhoto" @click.native="showQrCode(row.staffPhoto)">
                  <!--                  <img src="./src/assets/common/bigUserHeader.png" alt="">-->
                </el-avatar>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column :formatter="formatter" prop="formOfEmployment" label="聘用形式" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column label="入职时间" sortable="">
            <template v-slot="{row}">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="btnRoleDialog(row.id)">角色</el-button>
              <el-button :disabled="checkPermission('DELETE_USER')" type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page.sync="page.page"
            :page-size="page.size"
            layout="prev, pager, next, jumper,total"
            :total="total"
            @current-change="getEmpList"
          />
        </el-row>

        <!--   添加的展示与隐藏     -->
        <AddEmployess :isshow-add-employess.sync="isshowAddEmployess" />
        <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQrCode" @close="imgUrl=''">
          <el-row type="flex" justify="center">
            <canvas ref="canvas" />
          </el-row>
        </el-dialog>
        <AssignRoleVue ref="roleRef" :current-id="currentId" :show-role-dialog.sync="showRoleDialog" />
      </el-card>
    </div>
  </div>
</template>

<script>
// import ToolBar from '@/components/ToolBar'
import { mixins } from '@/utils/mixin'
import AssignRoleVue from '@/views/employees/components/assign-role'
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeList from '@/api/constant/employees'
import AddEmployess from '@/views/employees/components/add-employess'
import { formatDate } from '@/filters'
import qrCode from 'qrcode'
const headers = {
  '手机号': 'mobile',
  '姓名': 'username',
  '入职日期': 'timeOfEntry',
  '聘用形式': 'formOfEmployment',
  '转正日期': 'correctionTime',
  '工号': 'workNumber',
  '部门': 'departmentName'
}
export default {

  name: 'Enployees',
  components: { AddEmployess, AssignRoleVue },
  mixins: [mixins],
  data() {
    return {
      showRoleDialog: false,
      showCodeDialog: false,
      isshowAddEmployess: false,
      list: [],
      currentId: '',
      total: 0, // 总数
      page: {
        page: 1, // 当前页码
        size: 10
      }
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    // 点击角色按钮
    async btnRoleDialog(id) {
      this.currentId = id
      await this.$refs.roleRef.getUserDetailById(id)
      this.showRoleDialog = true
    },
    showQrCode(url) {
      try {
        // console.log(url)
        // console.log(this.$refs.canvas)
        this.showCodeDialog = true
        this.$nextTick(() => {
          qrCode.toCanvas(this.$refs.canvas, url)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async exportToExcel() {
      // 动态导入一个模块的时候，使用import语法
      // import返回值是一个promise
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      const resData = this.formatterData(rows, headers)
      const { export_json_to_excel } = await import(
      /* webpackChunkName:'export2Excel' */
        '@/utils/Export2Excel')
      // const tHeader = ['ID', '标题', '作者', '阅读', '时间']
      export_json_to_excel({
        header: Object.keys(headers), // 表头数组 -> ['姓名', '手机号', '入职日期', '聘用形式', ....]
        data: resData,
        filename: 'excel-list',
        autoWidth: true,
        bookType: 'xlsx'
      })
    },
    formatterData(row, headers) {
      // 遍历原始rows数据
      return row.map(item => {
        // item >> 员工对象
        // 返回值为数组
        // 顺序需要和headers的key -- 对应 >>
        // 直接map >> Objiect.keys(headers)
        // 可以拿到遍历每一项的中文key
        // 中文key >> 映射表 >> 英文的key ?
        return Object.keys(headers).map(key => {
          // 判断
          // 如果是时间 >> 格式化
          // 如果是聘用形式 >> 转化 >> 1 正式员工 >> 2 非正式员工 未知
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeeList.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 获取员工的综合列表数据
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.total = total
    },
    formatter(row, column, cellValue) {
      const currentData = EmployeeList.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    },
    async del(id) {
      // await delEmployee(id)
      // await this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      //
      // })
      try {
        await this.$confirm('是否要删除')
        await delEmployee(id)
        this.$message.success('删除成功!')
        // 从新拉取数据
        await this.getEmpList()
      } catch (e) {
        console.log(e)
      }
    }
    // handleCurrentChange(page) {
    //   this.page.page = page
    //   // 重新获取列表数据
    //   this.getEmpList()
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
