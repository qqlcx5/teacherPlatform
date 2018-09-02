<template>
  <div class="course-preview-unit">
    <div class="course-preview-unit__wrap">
      <h1 class="course-preview-unit__title">{{name}}</h1>
      <div class="course-preview-unit__item" v-for="item in list" :key="item.id">
        <div class="course-preview-unit__name" :title="item.teachingStepsName+'：'+item.templateName">{{item.teachingStepsName+'：'+item.templateName}}</div>
        <div class="course-preview-unit__time">
          <span class="can-edit" v-if="item.startTimeEditFlag" @click="showDialog(item, 'START')">{{item.startTime}}</span>
          <span v-else>{{item.startTime}}</span> 至
          <span class="can-edit" v-if="item.endTimeEditFlag" @click="showDialog(item, 'END')">{{item.endTime}}</span>
          <span v-else>{{item.endTime}}</span>
        </div>
        <div class="course-preview-unit__status">
          <i></i>
          <span>{{item.status === 'PUBLISH'?'已发布':'未发布'}}</span>
        </div>
        <div class="course-preview-unit__operate">
          <span class="lecture-suite-operate__btn" @click="view(item.refId)" v-if="item.refType === 'LECTURE'">
            <i class="iconfont icon-See"></i>查看
          </span>
          <!-- <router-link class="lecture-suite-operate__btn" :to="{name: 'LectureLib_detail', params: {lectureId: item.refId}}" v-if="item.refType === 'LECTURE'">
            <i class="iconfont icon-See"></i>查看
          </router-link> -->
          <router-link class="lecture-suite-operate__btn" target="_blank" :to="{name: 'Paper_detail', params: {id: item.refId}}" v-if="item.refType === 'PAPER'">
            <i class="iconfont icon-See"></i>查看
          </router-link>
        </div>
      </div>
    </div>
    <div style="text-align: center">
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
    </div>
    <el-dialog class="course-preview-unit__dialog" title="编辑时间" :visible.sync="visible" width="470px" :before-close="handleClose">
      <el-date-picker @change="changeStartTime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :picker-options="pickerOptionsStart" :disabled="!selectData.startTimeEditFlag" v-model="startTime" size="small" type="datetime" placeholder="选择开始日期时间" style="width: 200px">
      </el-date-picker>
      <span>至</span>
      <el-date-picker @change="changeEndTime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :picker-options="pickerOptionsEnd" :disabled="!selectData.endTimeEditFlag" v-model="endTime" size="small" type="datetime" placeholder="选择结束日期时间" style="width: 200px">
      </el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="medium" @click="updateTime" v-loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import moment from 'moment'
import { course } from '../../../api'
export default {
  data() {
    return {
      bindRecordId: this.$route.params.id,
      name: '',
      list: [],
      visible: false,
      startTime: '',
      endTime: '',
      submitLoading: false,
      selectData: {},
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.courseStartTime) {
            let endTime = +new Date(this.courseStartTime)
            // let endTime = +new Date(this.endTime)
            return (
              time.getTime() < Date.now() - 8.64e7 || time.getTime() > endTime
            )
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.startTime) {
            let startTime = +new Date(this.startTime)
            return (
              time.getTime() < Date.now() - 8.64e7 || time.getTime() < startTime - 8.64e7
            )
          }
        }
      }
    }
  },
  computed: {
    courseStartTime() {
      const st = this.$route.query.st
      const sd = this.$route.query.sd
      return sd + ' ' + st
    },
    courseEndTime() {
      const et = this.$route.query.et
      const sd = this.$route.query.sd
      return sd + ' ' + et
    }
  },
  created() {
    this.getInfo(this.bindRecordId)
  },
  methods: {
    async getInfo(bindRecordId) {
      try {
        let res = await course.getCourseBindInfo(bindRecordId)
        this.name = res.data.name
        this.list = res.data.templateList
      } catch (err) {
        this.$message.error(err)
      }
    },
    showDialog(item) {
      this.visible = true
      this.selectData = item
      this.startTime = item.startTime
      this.endTime = item.endTime
    },
    handleClose() {
      this.startTime = ''
      this.endTime = ''
      this.selectData = {}
      this.visible = false
      this.submitLoading = false
    },
    async updateTime() {
      let start = +new Date(this.startTime)
      let end = +new Date(this.endTime)
      if (start === end) {
        return this.$message.error('开始时间必须小于结束时间！')
      }
      this.submitLoading = true
      try {
        await course.updateCourseTime(
          this.selectData.id,
          this.startTime,
          this.endTime
        )
        this.selectData.startTime = this.startTime
        this.selectData.endTime = this.endTime
        this.visible = false
      } catch (err) {
        this.$message.error(err)
      }
      this.submitLoading = false
    },
    changeStartTime() {
      let start = +new Date(this.startTime)
      let end = +new Date(this.courseEndTime)
      if (start > end) this.startTime = this.courseEndTime
    },
    changeEndTime() {
      let start = +new Date(this.startTime)
      let end = +new Date(this.endTime)
      if (end < start) this.endTime = this.startTime
    },
    view(id) {
      let paramsEncode = this.$route.query.paramsEncode
      let attendanceId = this.$route.query.attendanceId
      let url = `/tr/api/lecture/${id}/preview`
      if (attendanceId && paramsEncode) {
        url = url + `?paramsEncode=${paramsEncode}&attendanceId=${attendanceId}&type=view`
      }
      window.open(url)
    }
  }
}
</script>

<style lang="less">
.course-preview-unit__dialog {
  & .el-dialog__header {
    background: #f5f7f9;
    border-bottom: 1px solid #ddd;
    text-align: center;
    & .el-dialog__title {
      font-size: 14px;
    }
  }
}
.course-preview-unit {
  background: #fff;
  padding: 50px 0;
}
.course-preview-unit__wrap {
  width: 960px;
  margin: 0 auto;
}
.course-preview-unit__item {
  display: flex;
  background: #eff7ff;
  height: 56px;
  line-height: 56px;
  padding: 0 30px;
  margin-bottom: 20px;
}
.course-preview-unit__title {
  font-size: 18px;
  text-align: center;
}
.course-preview-unit__name {
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 30px;
}
.course-preview-unit__time {
  .can-edit {
    color: #3587ff;
    text-decoration: underline;
    cursor: pointer;
  }
}
.course-preview-unit__status {
  padding: 0 30px;
  display: inline-flex;
  align-items: center;
  & > i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3587ff;
    margin-right: 8px;
  }
}
.lecture-suite-operate__btn {
  color: #3587ff;
  cursor: pointer;
  margin-left: 15px;
  text-decoration: none;
  &.is-delete {
    color: #fe5c5d;
  }
  & > i {
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style>
