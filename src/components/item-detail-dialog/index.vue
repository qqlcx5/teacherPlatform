<template lang="html">
  <div class="item-detail-diloag">
    <el-dialog title="题目详情" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" center>
      <v-question
        :data="data"
        :readonly="true"
        :can-opera="false"
        :has-analy="true" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small"  @click="handleClose">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vQuestion from '@/components/questions'

export default {
  name: 'itemDetailDialog',
  components: { vQuestion },
  props: {
    visible: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
</style>
