<template>
  <v-qu :idx="idx" style="margin-top: 30px" :data="data" :has-score="false" :has-idx="true" :has-analy="showAnaly" :can-opera="true">
    <template slot="btns">
      <span class="m-qu-btns__itm" @click="viewAnaly">{{showAnaly ? '隐藏解析':'显示解析'}}</span>
      <span class="m-qu-btns__itm" @click="doCorrect">纠错</span>
      <span class="m-qu-btns__itm" @click="addToLecture" :class="{'disabled': data.addFlag}">{{data.addFlag?'已被添加':'添加该题'}}</span>
    </template>
  </v-qu>
</template>

<script>
import vQu from '@/components/questions'
import correctDialog from '@/components/correct-dialog'
export default {
  components: {
    vQu
  },
  props: {
    data: Object,
    idx: [String, Number]
  },
  data() {
    return {
      showAnaly: false
    }
  },
  methods: {
    viewAnaly() {
      this.showAnaly = !this.showAnaly
    },
    doCorrect() {
      if (this.data.status === 'AVAILABLE') {
        correctDialog({ visible: true, itemDetail: this.data })
      } else {
        this.$message.error('该题目未启用，暂无法纠错！')
      }
    },
    addToLecture() {
      this.$emit('add-qu', this.data)
    }
  }
}
</script>

<style lang="less">
.m-qu-btns__itm.disabled{
  background: #f5f5f5;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
