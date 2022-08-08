<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixins } from '@/utils/mixin'
export default {
  name: 'Dashboard',
  // 解决逻辑复用
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  method() {
    this.hello()
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
