<template>
  <div class="teacher-schedule-course" :class="{'is-reserve': data.schedStatusName === '预', 'is-bind': data.bandingFlag}" :style="{top:position.top,left:position.left,height:height,marginLeft:data.marginLeft+'px'}">
    <el-popover ref="popover" placement="right" :title="`【${data.schedStatusName}】${data.subjectName}`" width="280" trigger="hover">
      <p class="teacher-schedule-course__poptxt">上课时间：{{`${data.courseDate} ${data.startTime}-${data.endTime}`}}</p>
      <p class="teacher-schedule-course__poptxt">上课地点：{{data.branchName}}</p>
      <p class="teacher-schedule-course__poptxt" v-if="data.schedStatusName === '正'">年级：{{data.gradeName}}</p>
      <p class="teacher-schedule-course__poptxt">学生姓名：{{data.studentName}}</p>
      <p class="teacher-schedule-course__poptxt">学管师：{{data.courseManagerName}}</p>
      <p class="teacher-schedule-course__poptxt" v-if="data.schedStatusName === '正'">讲义套件名称：{{data.lectureSuitName}}</p>
      <p class="teacher-schedule-course__poptxt" v-if="data.bandingFlag">
        <el-button type="primary" size="mini" @click="printLecture(data)">查看</el-button>
        <el-button type="warning" size="mini" @click="unbind" v-if="canBind">解除绑定</el-button>
      </p>
      <p class="teacher-schedule-course__poptxt" v-else-if="data.schedStatusName === '正' && canBind">
        <el-button type="primary" size="mini" @click="bindLecture">去绑定</el-button>
      </p>
    </el-popover>
    <div class="teacher-schedule-course__name" v-popover:popover>
      <span class="teacher-schedule-course__label">{{data.subjectName}}</span>
    </div>
  </div>
</template>

<script>
import { lecture } from '@/api'
import moment from 'moment'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    startDate: {
      default: new Date()
    }
  },
  data() {
    return {
      height: 0,
      position: {
        top: 0,
        left: 0
      }
    }
  },
  computed: {
    canBind() {
      let b = moment(`${this.data.courseDate} ${this.data.startTime}`)
      return moment().diff(b) < 0
    }
  },
  methods: {
    bindLecture() {
      this.$emit('bind', this.data)
    },
    // 课次解绑讲义套件
    async unbind() {
      try {
        await this.$confirm(
          `<p>确定解除讲义《${this.data.lectureSuitName}》与课次的绑定关系？</p><p style="color:#a9a9a9;margin-top:5px">解绑后可重新绑定</p>`,
          {
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }
        )
        await lecture.courseUnbindLectureSuite(this.data.bindRecordId)
        this.$emit('unbind')
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e)
      }
    },
    // // 课次解绑讲义
    // async unbindLecture() {
    //   this.$confirm(
    //     `<p>确定解除讲义《${this.data.lectureName}》与课次的绑定关系？</p><p style="color:#a9a9a9;margin-top:5px">解绑后可重新绑定</p>`,
    //     {
    //       dangerouslyUseHTMLString: true,
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     user
    //       .bindLecture(
    //         this.data.lectureId,
    //         this.data.courseId,
    //         this.data.attendanceId,
    //         false
    //       )
    //       .then(res => {
    //         this.$emit('unbind')
    //       })
    //       .catch(err => {
    //         this.$message.error(err)
    //       })
    //   })
    // },
    printLecture(data) {
      let sd = this.data.courseDate
      let st = this.data.startTime
      let et = this.data.endTime
      this.$router.push({name: 'mycourseDetailUnit', params: {id: data.bindRecordId}, query: {sd, st, et, paramsEncode: this.data.paramsEncode, attendanceId: this.data.attendanceId, type: 'view'}})
      // window.open(
      //   `/tr/api/lecture/${this.data.lectureId}/preview?&attendanceId=${this
      //     .data.attendanceId}&paramsEncode=${this.data.paramsEncode}`
      // )
    },
    parseTime(time) {
      let arr = time.split(':')
      return arr[0] * 60 * 60 * 1000 + arr[1] * 60 * 1000
    },
    computedHeight() {
      let l = this.parseTime(this.data.startTime)
      let r = this.parseTime(this.data.endTime)
      let diss = r - l
      this.height = diss * 100 / (17 * 60 * 60 * 1000) + '%'
    },
    computedPosition() {
      let lL = moment(this.startDate).format('YYYY-MM-DD')
      let lR = moment(this.data.courseDate)
      let tL = this.parseTime('7:00')
      let tR = this.parseTime(this.data.startTime)
      let tDiff = tR - tL
      let lDiff = lR.diff(lL, 'days')
      this.position.left = lDiff * 100 / 7 + '%'
      this.position.top = tDiff * 100 / (17 * 60 * 60 * 1000) + '%'
    }
  },
  mounted() {
    this.computedHeight()
    this.computedPosition()
  }
}
</script>

<style lang="less">
@import '../../../assets/less/variables.less';
.teacher-schedule-course {
  position: absolute;
  min-height: 30px;
  display: flex;
  margin-left: 10px;
  &__name {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    background: #daebff;
    font-size: 14px;
    width: 30px;
    border-radius: 15px;
    height: 100%;
    &::before {
      content: '正';
      background: #3587ff;
      display: block;
      color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
    }
  }
  &__con {
    margin-left: 15px;
    width: 80px;
  }
  &__poptxt {
    font-size: 12px;
    margin: 0 0 8px 0;
    text-align: left;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  &__lecture {
    font-size: 12px;
    line-height: 30px;
  }
  &__bind {
    color: @blue;
  }
  &__label {
    flex: 1;
    align-items: center;
    display: flex;
    width: 1em;
    margin: 0 auto;
  }
  &.is-reserve {
    margin-left: 105px;
  }
  &.is-reserve &__name {
    background: #ffe7c3;
    &::before {
      content: '预';
      background: #fcb444;
    }
  }
  &.is-bind &__name {
    background: #a7f1e0;
  }
}
</style>
