<template lang="html">
  <div class="process-step">
    <el-card>
      <el-steps :active="active" style="padding: 0 20px;">
        <el-step
          :title="item.title"
          :description="item.description"
          v-for="item in items"
          :key="item.active">
        </el-step>
      </el-steps>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProcessStep',
  props: {
    active: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .process-step {
    margin-bottom: 20px;
  }
</style>
