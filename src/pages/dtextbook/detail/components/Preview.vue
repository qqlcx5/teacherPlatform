<template lang="html">
  <el-dialog fullscreen title="" :visible.sync="visible" :before-close="handleClose" custom-class="preview-dialog" center width="800px">
    <el-button class="fullscreen-button" type="primary" size="mini" @click="handleClose">退出全屏</el-button>
    <v-lecture-readonly :data="data" />
  </el-dialog>
</template>

<script>
import vLectureReadonly from './LectureReadonly'

export default {
  name: 'PreviewLectureDialog',
  components: {
    vLectureReadonly
  },
  props: {
    visible: Boolean,
    data: Object
  },
  data() {
    return {
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less">
.preview-dialog {
  .el-dialog__header, .el-dialog__footer {
    display: none;
  }

  .fullscreen-button {
    position: absolute;
    right: 6px;
    top: 7px;
  }
}
</style>
