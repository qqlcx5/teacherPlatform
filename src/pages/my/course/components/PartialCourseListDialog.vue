<template lang="html">
  <div class="partial-courselist-dialog">
    <el-dialog
      custom-class="hi-dialog"
      center
      title="查看分场课程"
      :visible.sync="normalizedVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
      width="50%">
      <div class="dialog-body">
        <div class="standard-table">
          <el-table class="hi" border :data="items" style="width: 100%">
            <el-table-column prop="courseId" label="课程ID"></el-table-column>
            <el-table-column prop="courseName" label="课程名称"></el-table-column>
            <el-table-column prop="leadTeacherName" label="主讲老师"></el-table-column>
            <el-table-column prop="leadTeacherCode" label="主讲老师编码"></el-table-column>
            <el-table-column prop="assistantTeacherName" label="辅导老师"></el-table-column>
            <el-table-column prop="assistantTeacherCode" label="辅导老师编码"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: 'partial-courselist-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      normalizedVisible: this.visible
    }
  },
  watch: {
    visible () {
      this.normalizedVisible = this.visible
    }
  },
  methods: {
    closeDialog () {
      this.normalizedVisible = false
      this.$emit('partial-course-list-close', false)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
