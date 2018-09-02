<template>
  <el-table class="w-100-p" v-bind="$attrs" v-on="$listeners">
    <template v-for="(column, index) in columns">
      <table-cell :key="index" :column="column" />
    </template>
  </el-table>
</template>

<script>
import tableCell from './cell'

export default {
  name: 'table-index',
  components: { tableCell },
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  inheritAttrs: false,
  mounted() {}
}
</script>
