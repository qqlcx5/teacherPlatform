<template lang="html">
  <div class="course-detail">
    <el-card class="course-detail__card">
      <div class="course-detail__card-header">
        <span class="title">{{course.courseName}}</span>
        <div class="tag">
          <span>{{course.gradeName}}</span>
          <span>{{course.subjectName}}</span>
        </div>
        <el-button v-if="isDoubleTeacher" type="text" @click.prevent="openPartialCourseListDialog">查看分场课程</el-button>
      </div>
      <div class="course-detail__card-body">
        <el-row :gutter="20" type="flex" class="row-bg" justify="space-between">
          <el-col :span="8">
            <div class="course-detail__card-body__col">
              <p>课程ID: <span> {{course.courseId}}</span></p>
              <p>校区:  <span>  {{course.branchName}}</span></p>
              <p>课程日期: <span>{{course.courseStartDate}} 至 {{course.courseEndDate}}</span></p>
              <p>上课时间: <span>{{course.courseStartTime}} - {{course.courseEndTime}}</span></p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="course-detail__card-body__col">
              <p>主讲老师: <span>{{course.leadTeacherName}}</span></p>
              <p>辅导老师: <span>{{course.assistantTeacherName}}</span></p>
              <p>课时长度: <span>{{course.courseHour}}</span></p>
              <p>班级人数: <span>{{course.studentCount}}</span></p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="course-detail__card-body__col">
              <p v-if="productLine === 'FULLFILL_CLASS'">课程季: <span> {{course.courseSeasonName}}</span></p>
              <!-- <p>上课周期: <span>{{course.assistantTeacherName}}</span></p> -->
              <p>课程进度:
                <span style="color: #409eff;">{{course.finishedCount}}</span>
                <span style="margin-left: 4px;">/</span>
                <span style="margin-left: 4px;">{{course.total}}</span>
              </p>
              <p>课程状态: <span style="color: #409eff;">{{course.status | CourseStatus}}</span></p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="mt-20">
      <div class="standard-table">
        <el-table class="hi" border :data="tableData" style="width: 100%">
          <el-table-column prop="seq" label="课次" width="60" align="center"></el-table-column>
          <el-table-column prop="name" label="课次名称"></el-table-column>
          <el-table-column prop="startDate" label="上课日期" width="160"></el-table-column>
          <el-table-column prop="startTime" label="上课时间" width="100"></el-table-column>
          <el-table-column prop="endTime" label="下课时间" width="100"></el-table-column>
          <el-table-column prop="status" label="课次状态" width="120">
            <template slot-scope="scope">
              {{scope.row.status | Status}}
            </template>
          </el-table-column>
          <el-table-column prop="bindUpdateTime" label="绑定更新时间" width="200"></el-table-column>
          <el-table-column prop="bindUpdateUser" label="更新人" width="160"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <div slot-scope="scope">
              <router-link v-if="scope.row.bindStatus === 'BIND'" :to="{name: 'courseDetailUnit', params: {id:scope.row.bindRecordId}, query: {sd: scope.row.startDate, st: scope.row.startTime, et: scope.row.endTime}}">
                <el-tooltip effect="blue" content="预览" placement="top">
                  <button class="m-table-btn__operate"><i class="iconfont icon-See"></i></button>
                </el-tooltip>
              </router-link>
              <el-tooltip effect="blue" content="绑定" placement="top" v-if="scope.row.bindStatus === 'UNBOUND' && scope.row.status === 'TO_START'">
                <button class="m-table-btn__operate" @click.prevent="openBindDialog(scope.row)"><i class="iconfont icon-binding"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" content="解绑" placement="top" v-if="scope.row.bindStatus === 'BIND' && scope.row.status === 'TO_START'">
                <button class="m-table-btn__operate" @click.prevent="unbind(scope.row)"><i class="iconfont icon-Unbundling"></i></button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <bind-lecture-suite-dialog :visible.sync="bindLectureSuiteDialogVisible" @success-bind="successBind" :data="selectedCourseData" :product-line="productLine" :grade-id="gradeId" :course-id="courseId"/>
    <partial-course-list-dialog
      :visible="partialCourseListDialogVisible"
      :items="partialCourseList"
      @partial-course-list-close="partialCourseListClose" />
  </div>
</template>

<script>
import api from '@/api/course.js'
import PartialCourseListDialog from './components/PartialCourseListDialog.vue'
import bindLectureSuiteDialog from './components/bind-lecture-suite-dialog'
export default {
  name: 'course-detail',
  components: { PartialCourseListDialog, bindLectureSuiteDialog },
  data() {
    return {
      course: {},
      tableData: [],
      bindDialogVisible: false,
      partialCourseListDialogVisible: false,
      bindLectureSuiteDialogVisible: false,
      partialCourseList: [],
      selectedCourseData: {}
    }
  },
  computed: {
    courseId() {
      return this.$route.params.id
    },
    gradeId() {
      return this.course.gradeId || ''
    },
    productLine() {
      return this.$route.query.type || 'FULLFILL_CLASS'
    },
    isDoubleTeacher() {
      return this.productLine === 'DOUBLE_TEACHER'
    }
  },
  mounted() {
    this.getDetail(this.courseId)
  },
  methods: {
    async getDetail(id) {
      let res = await api.getCourseDetail({
        courseId: id,
        productLine: this.productLine
      })
      if (res.success) {
        this.course = res.data || {}
        this.tableData = res.data.courseTimesList
        this.$message.success(res.message || '请求成功')
      } else {
        this.$message.error(res.message || '请求失败...')
      }
    },
    openBindDialog(item) {
      this.selectedCourseData = item
      this.bindLectureSuiteDialogVisible = true
    },
    successBind(val) {
      Object.assign(this.selectedCourseData, val)
      this.bindLectureSuiteDialogVisible = false
    },
    unbind(item) {
      this.$confirm('确定解除课次与讲义套件的绑定关系', {
        type: 'warning'
      }).then(async () => {
        try {
          await api.unbindLectureSuite(item.bindRecordId)
          Object.assign(item, {
            bindRecordId: null,
            bindStatus: 'UNBOUND',
            bindUpdateUser: null,
            bindUpdateTime: null,
            lecturesuitId: null
          })
          this.$message.success('解绑成功')
        } catch (err) {
          this.$message.error(err)
        }
      })
    },
    async openPartialCourseListDialog() {
      let res = await api.getPartialDoubleTeacherCourseList({
        mtCourseId: this.course.courseId
      })
      if (res.success) {
        this.partialCourseListDialogVisible = true
        this.partialCourseList = res.data
      } else {
        this.$message.error(res.message || '无法获取分场信息列表...')
      }
    },
    partialCourseListClose() {
      this.partialCourseListDialogVisible = false
    }
  },
  filters: {
    CourseStatus(val) {
      switch (val) {
        case 'UNFINISHED':
          return '未结课'
        case 'FINISHED':
          return '已结课'
        default:
          return ''
      }
    },
    Status(val) {
      switch (val) {
        case 'TO_START':
          return '未开始'
        case 'START':
          return '正在上课'
        case 'END':
          return '已结束'
        default:
          return ''
      }
    },
    BindStatus(val) {
      switch (val) {
        case 'BIND':
          return '已绑定'
        case 'UNBOUND':
          return '未绑定'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.course-detail {
  &__card {
    &-header {
      display: flex;
      .title {
        font-weight: 800;
      }
      .tag {
        margin-left: 20px;
        span {
          color: #fff;
          background-color: #409eff;
          padding: 4px 8px;
          border-radius: 4px;
        }
      }
      button {
        padding: 0;
        margin-left: 20px;
      }
    }
    &-body {
      margin-top: 20px;
      color: #606266;
      &__col {
        p {
          span {
            margin-left: 20px;
          }
        }
      }
    }
  }
  &__cardlist {
    margin-top: 20px;
  }

  .table-pagination {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
