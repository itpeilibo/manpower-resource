
<template>
  <el-row type="flex" style="width: 100%;">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="6">
      <el-row type="flex">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown style="cursor: pointer" @command="operateDepts">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/departs'
export default {
  name: 'TreeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 监听下拉框菜单点击效果
    operateDepts(type) {
      if (type === 'add') {
        console.log('添加')
        // 添加子部门的操作
        // 告诉父组件显示弹层
        this.$emit('handleAddDept', this.treeNode)
        //
      } else if (type === 'edit') {
        console.log('编辑')
        //  触发父组件的编辑功能
        this.$emit('handleEditDept', this.treeNode)
      } else if (type === 'del') {
        console.log('删除')
        // 弹出层
        // confirm 返回的是一个promise
        // 成功 惦记了确定
        // 失败 取消
        this.$confirm('是否删除此条记录?', '温馨提示').then(() => {
          //   删除数据
          return delDepartments(this.treeNode.id)
        }).then(res => {
          // 重新获取列表数据
          this.$message('删除成功')
          this.$emit('handleGetDeparts')
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>
