<template>
  <el-dialog class="schedule-lecture-dialog" title="绑定讲义套件" :visible="visible" width="780px" :before-close="close">
    <el-form :inline="true" :model="searchForm" size="mini" @submit.native.prevent>
      <el-form-item label="年级">
        <el-select v-model="searchForm.gradeId" placeholder="选择年级" @change="search">
          <el-option :label="item.label" :value="item.code" v-for="item in gradeOptions" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="按讲义套件名称模糊搜索" v-model="searchForm.name" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" :loading="loading">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="lecture-car" :class="{'is-selected': selectedData.id}">
      <span v-if="selectedData.id">已选讲义套件：{{`${selectedData.name}（年级：${selectedData.gradeName}，课程类型：${selectedData.courseTypeName}）`}}</span>
      <span v-else>未选中任何讲义套件</span>
    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%;" size="mini">
      <el-table-column width="40">
        <template slot-scope="scope">
          <el-checkbox :value="scope.row.id === selectedData.id" @change="select(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="讲义套件名称" show-overflow-tooltip prop="name">
      </el-table-column>
      <el-table-column prop="gradeName" label="年级" width="80">
      </el-table-column>
      <el-table-column prop="courseTypeName" label="课程类型" width="100">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="150">
      </el-table-column>
    </el-table>
    <div class="mt-20 text-center">
      <el-pagination background layout="total, prev, pager, next" :total="pageTotal" :page-size="pageSize" :current-page="currentPage" @current-change="changePage">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" v-loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { user, lecture } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      submitLoading: false,
      tableData: [],
      selectedData: {},
      currentPage: 1,
      pageSize: 5,
      pageTotal: 0,
      searchForm: {
        gradeId: '',
        subjectId: '',
        name: ''
      },
      gradeOptions: [],
      loading: false
    }
  },
  computed: {
    params() {
      let {attendanceId, courseDate, courseId, endTime, startTime} = this.data
      return {attendanceId, courseDate, courseId, endTime, startTime}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.searchForm.gradeId = this.data.gradeId
        this.searchForm.subjectId = this.data.subjectId
        this.getGradeOptions(this.searchForm.gradeId)
        this.getLectureSuite(this.searchForm)
      }
    }
  },
  methods: {
    // 获取讲义套件列表
    async getLectureSuite({ currentPage = 1, pageSize = 5, ...data } = {}) {
      this.loading = true
      try {
        let res = await lecture.getLectureSuite({
          currentPage,
          pageSize,
          status: 'DISABLED',
          ...data
        })
        this.tableData = res.data.list
        this.currentPage = res.data.currentPage
        this.pageTotal = res.data.total
      } catch (e) {
        this.$message.error(e)
      }
      this.loading = false
    },
    // 搜索
    search() {
      this.getLectureSuite(this.searchForm)
    },
    // 分页跳转
    changePage(val) {
      this.currentPage = val
      this.getLectureSuite({
        currentPage: this.currentPage,
        ...this.searchForm
      })
    },
    // 绑定
    async bind() {
      this.submitLoading = true
      try {
        await lecture.courseBindLectureSuite({lectureSuitId: this.selectedData.id, bindFlag: false, ...this.params})
        this.$emit('ok')
        this.close()
      } catch (e) {
        this.$message.error(e)
      }
      this.submitLoading = false
    },
    submit () {
      if (!this.selectedData.id) {
        return this.$message.error('未选中任何讲义套件，请选择！')
      }
      this.bind()
    },
    // 获取选择器的数据
    async getGradeOptions(gradeId) {
      let res = await user.getGradeList(gradeId)
      this.gradeOptions = res.data || []
    },
    close() {
      this.searchForm.gradeId = ''
      this.searchForm.subjectId = ''
      this.searchForm.name = ''
      this.selectedData = {}
      this.$emit('update:visible', false)
    },
    select(item) {
      this.selectedData = item
    }
    // async getLectureList(
    //   { gradeId = '', subjectId = '', name = '', currentPage = 1, pageSize = 5 } = {}
    // ) {
    //   this.loading = true
    //   try {
    //     let res = await user.getLectureList({
    //       gradeId,
    //       subjectId,
    //       name,
    //       currentPage,
    //       pageSize
    //     })
    //     this.tableData = res.data.list
    //     this.currentPage = res.data.currentPage
    //     this.pageSize = res.data.pageSize
    //     this.pageTotal = res.data.total
    //   } catch (e) {
    //     this.$message.error('获取讲义列表失败！')
    //   }
    //   this.loading = false
    // },
    // // 获取选择器的数据
    // async getGradeOptions(gradeId) {
    //   try {
    //     let res = await user.getGradeList(gradeId)
    //     this.gradeOptions = res.data
    //   } catch (e) {
    //     this.$message.error(e)
    //   }
    // },
    // handleClose() {
    //   this.$emit('update:visible', !this.visible)
    // },
    // seachLecture() {
    //   this.getLectureList({
    //     gradeId: this.searchForm.gradeId,
    //     subjectId: this.data.subjectId,
    //     name: this.searchForm.name
    //   })
    // },
    // changePage(val) {
    //   this.currentPage = val
    //   this.getLectureList({
    //     gradeId: this.searchForm.gradeId,
    //     subjectId: this.data.subjectId,
    //     name: this.searchForm.name,
    //     currentPage: this.currentPage
    //   })
    // },
    // bindLecture() {
    //   if (this.selectedData.lectureId) {
    //     this.submitLoading = true
    //     user.bindLecture(this.selectedData.lectureId, this.data.courseId, this.data.attendanceId, true).then(res => {
    //       this.submitLoading = false
    //       this.$emit('ok')
    //       this.handleClose()
    //     }).catch(err => {
    //       this.submitLoading = false
    //       this.$message.error(err)
    //     })
    //   } else {
    //     this.$message.error('未选中任何讲义，请选择！')
    //   }
    // },
    // selectedLectrue(val) {
    //   this.selectedData = val
    // },
    // async initData() {
    //   this.selectedData = {}
    //   this.searchForm.gradeId = this.data.gradeId
    //   this.getGradeOptions(this.searchForm.gradeId)
    //   this.getLectureList({ gradeId: this.searchForm.gradeId, subjectId: this.data.subjectId })
    // }
  }
}
</script>
<style lang="less">
@import url(../../../assets/less/variables.less);
.schedule-lecture-dialog {
  .el-dialog__header {
    background: #f5f7f9;
    border-bottom: 1px solid @baseBorderColor;
    text-align: center;
    .el-dialog__title {
      font-size: 14px;
    }
  }
  .el-table th {
    background: #f8f8f9;
  }
  .lecture-car {
    height: 45px;
    line-height: 45px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid #ebeef5;
    margin-bottom: 15px;
    padding: 0 15px;
    color: #999;
    text-align: center;
    &.is-selected {
      color: #3587ff;
      border-color: #3587ff;
      text-align: left;
    }
  }
  .lecture-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
