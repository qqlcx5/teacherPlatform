<template>
  <el-dialog class="hi-dialog lecture-suite-bind-dialog" title="绑定" :visible="visible" width="800px" :before-close="handleClose">
    <div class="lecture-suite-car" :class="{'is-selected': selectedData.id}">
      <span v-if="selectedData.id && selectedData.lectureId">已选讲义：{{`${selectedData.name}（年级：${selectedData.gradeName}，课程类型：${selectedData.courseTypeName}，知识体系：${selectedData.regionName}）`}}</span>
      <span v-else-if="selectedData.id && selectedData.paperType">已选试卷：{{`${selectedData.paperName}（年级：${selectedData.grade}，试卷类型：${selectedData.paperType}，更新人：${selectedData.updateUser}）`}}</span>
      <span v-else>未选中任何讲义或试卷</span>
    </div>
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="讲义" name="LECTURE">
        <el-form :inline="true" :model="searchLectureForm" size="mini" @submit.native.prevent>
          <el-form-item label="年级">
            <el-select v-model="searchLectureForm.gradeId" placeholder="选择年级" @change="seachLecture">
              <el-option :label="item.label" :value="item.code" v-for="item in gradeOptions" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="讲义名称" v-model="searchLectureForm.searchKey" @keyup.enter.native="seachLecture"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="seachLecture">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table height="222" v-if="activeName==='LECTURE'" v-loading="lectureLoading" :data="lectureList" style="width: 100%;" size="mini">
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-checkbox :value="scope.row.id === selectedData.id" @change="selectedItem(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="讲义名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="gradeName" label="年级" width="80">
          </el-table-column>
          <el-table-column prop="courseTypeName" label="课程类型">
          </el-table-column>
          <el-table-column prop="regionName" label="知识体系">
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
          </el-table-column>
        </el-table>
        <div class="mt-20 text-center">
          <el-pagination background layout="prev, pager, next" :page-size="5" :current-page="lectureCurrentPage" :total="lectureTotal" @current-change="changeLecturePage">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="试卷" name="PAPER">
        <el-form :inline="true" :model="searchPaperForm" size="mini" @submit.native.prevent>
          <el-form-item label="年级">
            <el-select v-model="searchPaperForm.gradeId" placeholder="选择年级" @change="seachPaper">
              <el-option :label="item.label" :value="item.code" v-for="item in gradeOptions" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchPaperForm.paperTypeId" placeholder="选择类型" @change="seachPaper">
              <el-option :label="item.label" :value="item.code" v-for="item in paperTypeOptions" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="试卷名称" v-model="searchPaperForm.searchKey" @keyup.enter.native="seachPaper"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="seachPaper">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table height="222" v-if="activeName==='PAPER'" v-loading="paperLoading" :data="paperList" style="width: 100%;" size="mini">
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-checkbox :value="scope.row.id === selectedData.id" @change="selectedItem(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="paperName" label="试卷名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="grade" label="年级">
          </el-table-column>
          <el-table-column prop="paperType" label="类型">
          </el-table-column>
          <el-table-column prop="updateUser" label="更新人">
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
          </el-table-column>
        </el-table>
        <div class="mt-20 text-center">
          <el-pagination background layout="prev, pager, next" :page-size="5" :current-page="paperCurrentPage" :total="paperTotal" @current-change="changePaperPage">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="bindLectureSuite" v-loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { lecture, app } from '../../api'
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
    },
    templateId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      activeName: 'LECTURE',
      submitLoading: false,
      selectedData: {},
      searchLectureForm: {
        gradeId: '',
        searchKey: ''
      },
      searchPaperForm: {
        gradeId: '',
        paperTypeId: '',
        searchKey: ''
      },
      gradeOptions: [],
      paperTypeOptions: [],
      lectureList: [],
      lectureSuitId: this.$route.params.id,
      lectureLoading: false,
      paperList: [],
      paperLoading: false,
      lectureCurrentPage: 1,
      lectureTotal: 0,
      paperCurrentPage: 1,
      paperTotal: 0
    }
  },
  watch: {
    visible(n, o) {
      if (n) {
        this.getLectureList()
        this.getPaperList()
      }
    }
  },
  created() {
    // this.getLectureList()
    // this.getPaperList()
    this.getGradeOptions()
    this.getPaperTypeOptions()
  },
  methods: {
    async getLectureList({
      gradeId = '',
      searchKey = '',
      currentPage = 1,
      pageSize = 5
    } = {}) {
      this.lectureLoading = true
      try {
        let res = await lecture.getLectureSuiteBandingLecture({
          gradeId,
          searchKey,
          currentPage,
          pageSize,
          lectureSuitId: this.lectureSuitId
        })
        if (res.data.list) this.lectureList = res.data.list
        if (res.data.currentPage) this.lectureCurrentPage = res.data.currentPage
        if (res.data.total) this.lectureTotal = res.data.total
      } catch (e) {
        this.$message.error(e)
      }
      this.lectureLoading = false
    },
    async getPaperList({
      gradeId = '',
      paperTypeId = '',
      searchKey = '',
      currentPage = 1,
      pageSize = 5
    } = {}) {
      this.paperLoading = true
      try {
        let res = await lecture.getLectureSuiteBandingPaper({
          gradeId,
          paperTypeId,
          searchKey,
          currentPage,
          pageSize,
          lectureSuitId: this.lectureSuitId
        })
        if (res.data.list) this.paperList = res.data.list
        if (res.data.currentPage) this.paperCurrentPage = res.data.currentPage
        if (res.data.total) this.paperTotal = res.data.total
      } catch (e) {
        this.$message.error(e)
      }
      this.paperLoading = false
    },
    // 获取选择器的数据
    async getGradeOptions() {
      try {
        let res = await app.selector.get('GRADE')
        if (res.data instanceof Array && res.data[0] && res.data[0].list) {
          this.gradeOptions = res.data[0].list
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 获取试卷类型的数据
    async getPaperTypeOptions() {
      try {
        let res = await app.selector.get('PAPER_TYPE')
        if (res.data instanceof Array && res.data[0] && res.data[0].list) {
          this.paperTypeOptions = res.data[0].list
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    async changeLecturePage(val) {
      this.lectureCurrentPage = val
      this.getLectureList({
        currentPage: this.lectureCurrentPage,
        ...this.searchLectureForm
      })
    },
    async changePaperPage(val) {
      this.paperCurrentPage = val
      this.getPaperList({
        currentPage: this.paperCurrentPage,
        ...this.searchPaperForm
      })
    },
    async seachLecture() {
      this.getLectureList({ ...this.searchLectureForm })
    },
    async seachPaper() {
      this.getPaperList({ ...this.searchPaperForm })
    },
    selectedItem(item) {
      this.selectedData = this.selectedData.id === item.id ? {} : item
      this.selectedData.refType = this.activeName
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.searchLectureForm = {
        gradeId: '',
        searchKey: ''
      }
      this.searchPaperForm = {
        gradeId: '',
        paperTypeId: '',
        searchKey: ''
      }
      this.selectedData = {}
    },
    async handleBindLectureSuite({ templateId, refType, refId, bindStatus }) {
      try {
        let res = await lecture.bindLectureSuite({
          templateId,
          refType,
          refId,
          bindStatus
        })
        return res
      } catch (e) {
        this.$message.error(e)
      }
    },
    async bindLectureSuite() {
      this.submitLoading = true
      if (this.selectedData.id) {
        try {
          let res = await this.handleBindLectureSuite({
            templateId: this.templateId,
            refId: this.selectedData.id,
            refType: this.selectedData.refType,
            bindStatus: 'BIND'
          })
          this.$emit('bind', res.data)
          this.handleClose()
        } catch (e) {}
      } else {
        this.$message.error('未选择任何讲义或试卷，无法绑定！')
      }
      this.submitLoading = false
    }
  }
}
</script>

<style lang="less">
@import url(../../assets/less/variables.less);
.lecture-suite-car {
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
.lecture-suite-bind-dialog {
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
}
</style>
