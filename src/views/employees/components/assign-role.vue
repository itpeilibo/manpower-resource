<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRoleVue',

  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    currentId: {
      type: String
    }
  },
  data() {
    return {
      // showRoleDialog: false
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          // 点击了编辑的时候，从父组件传下来的当前用户id
          id: this.currentId,
          roleIds: this.roleIds
        })
        this.$message.success('修改角色成功')
        this.close()
      } catch (e) {
        this.$message.error('修改失败')
        this.close()
      }
    },
    // 获取所有角色列表
    async getRoleList() {
      const { rows } = await getRoleList()
      // console.log(rows)
      this.list = rows
    },
    // 获取当前点击用户的角色数据，给roleIds进行赋值
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      // 给一个默认值
      // console.log(roleIds)
      this.roleIds = roleIds
    },
    close() {
      // 手动修改父组件的弹层标识变为false
      // 这个属性使用，sync传递下来的
      // 当前选中的角色列表数据清空
      this.$emit('update:showRoleDialog', false)
      // this.showRoleDialog = false
    }
  }
}
</script>

<style scoped>

</style>
