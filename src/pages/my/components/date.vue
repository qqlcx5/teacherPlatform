<template>
  <div class="schedule-date-picker">
    <el-date-picker class="schedule-date-picker__date" v-model="date" ref="datePicker" style="visibility: hidden" type="date" :editable="false" placeholder="选择日期">
    </el-date-picker>
    <el-button class="schedule-date-picker__txt" @click="showDate">{{dateText}}</el-button>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: ['value'],
  computed: {
    dateText() {
      let date = moment(this.value).startOf('isoWeek')
      let startDate = date.format('YYYY年MM月DD号')
      let endDate = date.add(6, 'd').format('YYYY年MM月DD号')
      return `${startDate}-${endDate}`
    },
    date: {
      set(val) {
        this.$emit('input', val)
      },
      get() {
        return this.value
      }
    }
  },
  methods: {
    showDate() {
      this.$refs['datePicker'].showPicker()
    }
  }
}
</script>

<style lang="less">
.schedule-date-picker {
  position: relative;
  display: inline-block;
  width: 256px;
  &__date {
    width: 256px !important;
  }
  &__txt {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
