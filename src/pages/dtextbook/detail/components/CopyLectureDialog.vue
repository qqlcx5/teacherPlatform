<template>
  <el-dialog :visible="visible" class="hi-dialog" title="复制" width="460px" :before-close="handleClose">
    <P>将{{title}}复制到</P>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item>
        <el-select v-model="form.lecture" placeholder="请选择">
          <el-option v-for="item in list1" :key="item.key" :label="item.value" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { dtextbook } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: String
    },
    chapterId: { type: String },
    lectureId: { type: String }
  },
  computed: {
    activeItem() {
      return this.$store.state.app.list.find(item => item.key === this.activeName)
    },
    title() {
      return this.activeItem && this.activeItem.value
    },
    list1() {
      let arr = []
      this.$store.state.app.list.forEach(item => {
        if (this.activeName !== item.key) {
          arr.push(item)
        }
      })
      return arr
    }
  },
  data() {
    return {
      form: {
        lecture: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    submitForm(formName) {
      dtextbook
        .copyLectureTo({
          id: this.chapterId,
          lectureId: this.lectureId,
          lectureType: this.form.lecture,
          templateIds: []
        })
        .then(() => this.handleClose())
    }
  }
}
</script>

<style lang="less">
</style>
