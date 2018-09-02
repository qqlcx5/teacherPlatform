<template lang="html">
  <el-dialog class="hi-dialog" title="编辑目录" :visible="visible" width="400px" :before-close="handleClose">
    <div class="module-list">
      <ul class="list-group" v-sortable>
        <li class="list-group-item" v-for="item of data" :key="item.id">{{item.templateName}}</li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'lecture-module-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: [{
        id: 1,
        templateName: 'xx'
      }, {
        id: 2,
        templateName: 'xx2'
      }, {
        id: 3,
        templateName: 'xx3'
      }, {
        id: 4,
        templateName: 'xx4'
      }]
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    }
  },
  mounted() {

  }
}
</script>

<style lang="less">
</style>
