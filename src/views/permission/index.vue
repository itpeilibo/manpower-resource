<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <tool-bar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addShowDialog('0',1)">添加权限</el-button>
        </template>
      </tool-bar>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" type="index" label="序号" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作" prop="enVisible">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addShowDialog(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermissionList(row.id)">编辑</el-button>
            <el-button type="text" @click="editPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${title}权限`" :visible="showDialog" @close="close">
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" autocomplete="off" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      是否开启
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { transListToTree } from '@/utils'

export default {
  data() {
    return {
      list: [],
      value: true,
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 初始化的时候获取所有的权限列表数据
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListToTree(res, '0')
      // console.log(this.list)
    },
    // 编辑
    async editPermissionList(id) {
      const res = await getPermissionDetail(id)
      // console.log(res)
      // 回显数据
      this.formData = res
      // 打开弹窗
      this.showDialog = true
    },
    // 确认
    async btnOk() {
      // 什么时候才是编辑，什么时候才是添加
      // 是否有id >> 是否编辑
      // 1. 表单校验
      await this.$refs.formRef.validate()
      try {
        // 判断是否id有就编辑反之就是添加
        if (this.formData.id) {
          // 编辑
          await updatePermission(this.formData)
        } else {
          // 新增
          await addPermission(this.formData)
        }
        this.$message.success(`${this.title}权限点成功!`)
        // 关闭弹层
        // this.showDialog = false
        this.close()
        // 刷新数据
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.error('修改失败!')
      }
    },
    close() {
      // 表单重置 重置校验
      this.$refs.formRef.resetFields()
      // 数据重置
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    },
    // 添加权限
    async addShowDialog(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },

    // 删除按钮
    async editPermission(id) {
      try {
        await this.$confirm('确定删除该数据吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delPermission(id)
        await this.$message.success('删除成功')
        // 从新获取最新列表数据
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.info('取消了删除')
      }
    }
  }
}
</script>

<style>

</style>

