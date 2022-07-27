<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container dep">
      <el-card :body-style="{background: '#67C23A', color: '#fff'}" shadow="never">
        <TreeTools
          :is-root="true"
          :tree-node="companyNode"
          @handleAddDept="handleAddDept"
        />
      </el-card>
      <el-tree :default-expand-all="true" :data="departs" :props="defaultProps" @node-click="handleNodeClick">
        <template v-slot="{data}">
          <TreeTools
            :tree-node="data"
            @handleEditDept="handleEditDept"
            @handleAddDept="handleAddDept"
            @handleGetDeparts="handleGetDeparts"
          />
        </template>
      </el-tree>
    </div>
    <!-- 添加部门弹层组件  -->
    <!-- .sync方法 -->
    <!--  双向数据绑定 属性名不变  -->
    <!-- 提供给子组件一个自定义事件，用于修改当前字段   -->
    <!-- 事件名称:('update:属性名')   -->
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @getDept="handleGetDeparts" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departs'
import { transListToTree } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      node: {},
      defaultProps: {
        label: 'name'
      },
      companyNode: {
        name: '巨人的小脚丫教育科技股份有限公司',
        manager: '负责人'
      },
      departs: [{ name: '总裁办', manager: '时jj', children: [{ name: '董事会' }] },
        { name: '行政部' }, { name: '人事部' }]
    }
  },
  created() {
    this.handleGetDeparts()
  },
  methods: {
    handleNodeClick() {
    },
    // 添加子部门的事件
    handleAddDept(node) {
      this.node = node
      this.showDialog = true
    },
    // 编辑部门的功能
    handleEditDept(node) {
      // 弹出层做展示
      this.showDialog = true
      // 因为node是当前的点击的部门,记录当前点击的节点信息
      this.node = node
      //  调用子组件获取详细信息的方法
      this.$refs.addDept.getDeptsDetail(node.id)
    },
    async handleGetDeparts() {
      this.loading = true
      const data = await getDepartments()
      // 公司信息
      this.companyNode = {
        name: data.companyName,
        manager: data.companyManage || '负责人',
        id: ''
      }
      // tree组件的信息
      this.departs = transListToTree(data.depts, '')
      this.loading = false
    }
  }
}

</script>

<style>
.dep {
  width: 1000px;
  margin: 0 auto;
}
</style>
