<template>
  <div class="teacher-schedule">
    <div class="teacher-schedule__hd">
      <img :src="userInfo.photo" alt="" class="teacher-schedule-avatar">
      <div class="teacher-schedule-profile">
        <h3 class="teacher-schedule-profile__name">{{userInfo.teacherName}}老师的日程安排</h3>
        <p class="teacher-schedule-profile__des">{{userInfo.subjects && userInfo.subjects.join(',')}}</p>
      </div>
    </div>
    <div class="teacher-schedule__bd">
      <div class="teacher-schedule-days mb-20">
        <div>
          <el-button @click="toToday">返回今天</el-button>
          <el-button icon="el-icon-arrow-left" @click="prev"></el-button>
          <v-date style="margin: 0 8px" v-model="currentDate" />
          <el-button icon="el-icon-arrow-right" @click="next"></el-button>
        </div>
        <div>
          <span class="teacher-schedule-chunk is-reserve">预排课次</span>
          <span class="teacher-schedule-chunk is-bind">已绑讲义课次</span>
          <span class="teacher-schedule-chunk">未绑讲义课次</span>
        </div>
      </div>
      <div class="teacher-schedule-table">
        <ul class="teacher-schedule-table__row teacher-schedule-table__head">
          <li class="teacher-schedule-table__col is-time">时间段</li>
          <li class="teacher-schedule-table__col" v-for="day in days" :key="day"><span :class="{'is-today': day === today}">{{day|formatDate}}</span></li>
        </ul>
        <ul class="teacher-schedule-table__row teacher-schedule-table__item" v-for="n in 17" :key="n">
          <li class="teacher-schedule-table__col is-time">{{6+n}}:00</li>
          <li class="teacher-schedule-table__col" v-for="day in days" :key="day" :class="{'is-today': day === today}"></li>
        </ul>
        <div class="teacher-schedule-course__wrap">
          <schedule-course :data="item" :start-date="startDate" @bind="showLectureDialog" @unbind="getSchedule(startDate, endDate)" v-for="item in data" :key="item.teacherId" />
        </div>
      </div>
    </div>
    <bind-lecture-dialog :visible.sync="lectureDiaLogVisible" :data="selectCourse" @ok="getSchedule(startDate, endDate)" />
  </div>
</template>

<script>
import moment from 'moment'
import vDate from './components/date'
import ScheduleCourse from './components/schedule-course'
import { user } from '@/api'
import bindLectureDialog from './components/bind-lecture-dialog'
export default {
  data() {
    return {
      currentDate: new Date(),
      daysSize: 7,
      data: [],
      userInfo: {},
      lectureDiaLogVisible: false,
      selectCourse: {},
      canRun: null
    }
  },
  computed: {
    startDate() {
      return moment(this.currentDate).startOf('isoWeek').format('YYYY-MM-DD')
    },
    endDate() {
      return moment(this.startDate).add(this.daysSize - 1, 'd').format('YYYY-MM-DD')
    },
    today() {
      return moment().format('YYYY-MM-DD')
    },
    days() {
      let arr = []
      for (let i = 0; i < this.daysSize; i++) {
        let date = moment(this.startDate)
          .add(i, 'd')
          .format('YYYY-MM-DD')
        arr.push(date)
      }
      return arr
    }
  },
  methods: {
    initData() {
      this.getSchedule(this.startDate, this.endDate)
      this.getUserInfo()
    },
    toToday() {
      this.currentDate = new Date()
    },
    prev() {
      this.currentDate = moment(this.currentDate).subtract(this.daysSize, 'd')
    },
    next() {
      this.currentDate = moment(this.currentDate).add(this.daysSize, 'd')
    },
    changeDate() {
      this.$refs['datePicker'].showPicker()
    },
    async getSchedule(startDate, endDate) {
      this.data = []
      try {
        let res = await user.getSchedule(startDate, endDate)
        if (res.data && res.data.length > 1) {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = i + 1; j < res.data.length; j++) {
              if (res.data[i].courseDate === res.data[j].courseDate) {
                let startTimeA = this.parseTime(res.data[i].startTime)
                let endTimeA = this.parseTime(res.data[i].endTime)
                let startTimeB = this.parseTime(res.data[j].startTime)
                let endTimeB = this.parseTime(res.data[j].endTime)
                let bol = this.hasTimeIntersection(
                  startTimeA,
                  endTimeA,
                  startTimeB,
                  endTimeB
                )
                if (bol) {
                  if (!res.data[i].marginLeft) res.data[i].marginLeft = 10
                  res.data[j].marginLeft = res.data[i].marginLeft + 45
                }
              }
            }
          }
        }
        this.data = res.data
      } catch (e) {
        this.$message.error(e)
      }
    },
    async getUserInfo() {
      try {
        let res = await user.getUserInfo()
        if (res.data) this.userInfo = res.data
      } catch (e) {
        this.$message.error(e)
      }
    },
    parseTime(time) {
      let arr = time.split(':')
      return arr[0] * 60 * 60 * 1000 + arr[1] * 60 * 1000
    },
    showLectureDialog(val) {
      this.selectCourse = val
      this.lectureDiaLogVisible = true
    },
    hasTimeIntersection(startTimeA, endTimeA, startTimeB, endTimeB) {
      if (startTimeA >= endTimeB || startTimeB >= endTimeA) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    currentDate(n, o) {
      let ol = moment(o).format('YYYY-MM-DD')
      let ne = moment(n).format('YYYY-MM-DD')
      if (ne !== ol) {
        this.data = []
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getSchedule(this.startDate, this.endDate)
        }, 300)
      }
    }
  },
  filters: {
    formatDate(val) {
      let date = moment(val)
      let weeks = ['日', '一', '二', '三', '四', '五', '六']
      let day = date.format('MM月DD号')
      let week = date.format('d')
      return `周${weeks[week]}（${day}）`
    }
  },
  mounted() {
    this.initData()
  },
  components: {
    ScheduleCourse,
    bindLectureDialog,
    vDate
  }
}
</script>

<style lang="less">
@import '../../assets/less/variables.less';
.teacher-schedule {
  background: #fff;
  padding: 30px;
  border: 1px solid @baseBorderColor;
  &__hd {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  &-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  &-profile {
    margin-left: 15px;
    &__name {
      font-size: 16px;
      margin: 0 0 10px 0;
      font-weight: normal;
    }
    &__des {
      font-size: 12px;
      margin: 0;
      color: @grayLight;
    }
    &__spit {
      margin: 0 8px;
    }
  }
  &-days {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;
  }
  &__bd {
    border-top: 1px solid @baseBorderColor;
    padding-top: 30px;
  }
  &-table {
    border-width: 1px 0 0 1px;
    border-style: solid;
    border-color: @baseBorderColor;
    position: relative;
    &__row {
      padding: 0;
      list-style: none;
      display: flex;
      margin: 0;
    }
    &__col {
      flex: 1;
      height: 50px;
      line-height: 30px;
      border-width: 0 1px 1px 0;
      border-style: solid;
      border-color: @baseBorderColor;
      padding: 10px;
      box-sizing: border-box;
      &.is-time {
        width: 100px;
        flex: none;
        background: #f6f7fb;
      }
      &.is-today{
        background: #fbfbfb;
      }
      &>.is-today{
        color: red
      }
    }
    &__head {
      background: #f6f7fb;
      text-align: center;
      font-size: 14px;
    }
    &__item &__col {
      height: 80px;
      line-height: 60px;
    }
  }
  &-course__wrap {
    position: absolute;
    top: 50px;
    left: 100px;
    right: 0;
    bottom: 0;
  }
  &-chunk {
    display: inline-flex;
    align-items: center;
    margin-left: 20px;
    &::before {
      width: 14px;
      height: 14px;
      content: '';
      display: block;
      background: #daebff;
      margin-right: 8px;
      border: 1px solid @baseBorderColor;
    }
    &.is-reserve::before {
      background: #ffe7c3;
    }
    &.is-bind::before {
      background: #a7f1e0;
    }
  }
}
</style>
