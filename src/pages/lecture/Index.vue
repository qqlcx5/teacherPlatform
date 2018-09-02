<template lang="html">
  <div class="lecture-index">
    <div class="tab">
      <span><i class="sidebar__sub-icon active"></i>我的讲义</span>
      <span @click.prevent="gotoKnowledgeImport"><i class="sidebar__sub-icon"></i>我的知识引入</span>
      <span @click.prevent="gotoKnowledgeSummary"><i class="sidebar__sub-icon"></i>我的知识总结</span>
      <span @click.prevent="gotoKnowledgeSuite"><i class="sidebar__sub-icon"></i>讲义套件</span>
      <span @click.prevent="gotoMyPaper">
        <i class="sidebar__sub-icon"></i>我的试卷</span>
    </div>
    <div class="table-list-form">
      <search-bar v-model="searchKey" @search="onSubmit" class="mb-20 mr-20" placeholder-text="请输入讲义名称"/>
    </div>
    <div class="">
      <topic-selector @change="changeSelector" type="LECTURE" ref="topicSelector" />
    </div>
    <el-card>
      <div class="table-list-operator">
        <el-button size="small" icon="el-icon-plus" type="primary" @click="openAddLectureDialog">添加讲义</el-button>
        <p class="text-right mr-10">共{{ total || 0 }}份讲义</p>
      </div>
      <div class="standard-table">
        <el-table class="hi" border :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="讲义名称"  :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="gradeName" label="年级" width="100"></el-table-column>
          <el-table-column prop="courseTypeName" label="课程类型" width="100"></el-table-column>
          <el-table-column prop="source" label="来源">
            <template slot-scope="scope">
              <span>{{scope.row.source | source}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品线" width="100"></el-table-column>
          <el-table-column prop="shareUserName" label="分享者" width="100"></el-table-column>
          <el-table-column prop="status" label="讲义状态" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.status | status}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shareFlag" label="是否分享" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.shareFlag">已分享</span>
              <span v-else>未分享</span>
            </template>
          </el-table-column>
          <el-table-column prop="replicaNum" label="被复制次数" width="90"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="160"></el-table-column>
          <el-table-column fixed="right" label="操作" width="260" align="left">
            <template slot-scope="scope">
              <el-tooltip effect="blue" content="预览" placement="top">
                <button class="m-table-btn__operate" @click.prevent="preview(scope.$index)"><i class="iconfont icon-See"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" content="复制" placement="top">
                <button class="m-table-btn__operate" @click.prevent="copy(scope.$index)"><i class="iconfont icon-copy"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" :content="!scope.row.shareFlag?'分享':'取消分享'" placement="top">
                <button class="m-table-btn__operate" @click="share(scope.$index)"><i class="iconfont" :class="[!scope.row.shareFlag?'icon-share':'icon-Cancellation_of_sharing']"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" v-if="scope.row.status !== 'DISABLED'" content="编辑" placement="top">
                <button class="m-table-btn__operate" @click.prevent="edit(scope.$index)"><i class="iconfont icon-edit"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" v-if="scope.row.status !== 'DISABLED'" content="发布" placement="top">
                <button class="m-table-btn__operate" @click.prevent="publish(scope.$index)"><i class="iconfont icon-Release"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" v-if="!(scope.row.shareFlag || scope.row.status === 'DISABLED')" content="删除" placement="top">
                <button class="m-table-btn__operate is-delete" @click.prevent="handleDeleteDialog(scope.$index)"><i class="iconfont icon-delete_1"></i></button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="formInline.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="formInline.pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <add-lecture-Basicinfo-dialog
      :visible.sync="diaLogVisible"
      :grade-list="gradeList"
      :course-list="courseList"
      :product-line-list="productLineList" />
  </div>
</template>

<script>
import TopicSelector from '@/components/topicSelector/Index'
import SearchBar from '@/components/searchBar/Index'
import api from '@/api/lecture'
import addLectureBasicinfoDialog from './components/addLectureBasicinfoDialog.vue'

export default {
  name: 'lectureIndex',
  components: { TopicSelector, SearchBar, addLectureBasicinfoDialog },
  data() {
    return {
      formInline: {
        name: '',
        currentPage: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      diaLogVisible: false,
      searchKey: ''
    }
  },
  mounted() {
    const params = {
      currentPage: 1,
      pageSize: 10
    }
    this.getLectureList(params)
  },
  computed: {
    userSgr() {
      return this.$store.state.user.userSgr
    },
    topicSelectOptions() {
      return this.$store.state.app.topicSelectOptions
    },
    gradeList() {
      return this.filterArrayByKey(this.topicSelectOptions, 'gradeId')
    },
    courseList() {
      return this.filterArrayByKey(this.topicSelectOptions, 'courseTypeId')
    },
    productLineList () {
      return this.filterArrayByKey(this.topicSelectOptions, 'productCode')
    }
  },
  filters: {
    status(val) {
      switch (val) {
        case 'TOCONFIRM':
        case 'AVAILABLE':
          return '未发布'
        case 'DISABLED':
          return '已发布'
        default:
          return ''
      }
    },
    source(val) {
      switch (val) {
        case 'USER_DEFINED':
          return '自创'
        case 'SYSTEM_IMPORT':
          return '系统导入'
        case 'USER_COPY':
          return '分享库'
        case 'TEXT_BOOK_COPY':
          return '精品教材'
        default:
          return ''
      }
    }
  },
  watch: {
    userSgr(val) {
      this.getLectureList(this.formInline)
    }
  },
  methods: {
    getLectureList(params) {
      api.lectureList(params).then(res => {
        if (res.success) {
          this.$message({ message: res.message || '请求成功', type: 'success' })
          this.tableData = res.data.list || []
          this.total = res.data.total || 0
        }
      })
    },
    onSubmit(val) {
      this.formInline.name = val
      this.initPageSize()
      this.initCurrentPage()
      this.getLectureList(this.formInline)
    },
    openAddLectureDialog() {
      this.diaLogVisible = true
    },
    initPageSize() {
      this.formInline.pageSize = 10
    },
    initCurrentPage() {
      this.formInline.currentPage = 1
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getLectureList(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.currentPage = val
      this.getLectureList(this.formInline)
    },
    handleDeleteDialog(index) {
      let id = this.tableData[index].id
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteLecture(id)
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    deleteLecture(id) {
      api.deleteLeture(id).then(
        resp => {
          this.$message({ type: 'success', message: '删除成功' })
          this.getLectureList(this.formInline)
        },
        () => {
          this.$message({ type: 'error', message: '删除失败' })
        }
      )
    },
    changeSelector(data) {
      this.formInline = Object.assign({}, this.formInline, { ...data })
      this.getLectureList(this.formInline)
    },
    edit(index) {
      let lectureId = this.tableData[index].lectureId
      this.$router.push({
        name: 'groupLecture',
        params: {
          lectureId: lectureId
        }
      })
    },
    preview(index) {
      let lectureId = this.tableData[index].lectureId
      this.$router.push({
        name: 'PreviewLecture',
        params: {
          lectureId: lectureId
        },
        query: {...this.$route.query, type: 'view'}
      })
    },
    // tab 跳转
    gotoKnowledgeImport() {
      this.$router.push({
        name: 'lecture_knowledge_import',
        query: this.$route.query
      })
    },
    gotoKnowledgeSummary() {
      this.$router.push({
        name: 'lecture_knowledge_sumary',
        query: this.$route.query
      })
    },
    gotoKnowledgeSuite() {
      this.$router.push({
        name: 'lecture_suite',
        query: this.$route.query
      })
    },
    gotoMyPaper() {
      this.$router.push({
        name: 'my_paper'
      })
    },
    share(index) {
      let item = this.tableData[index]
      let shareFlag = item.shareFlag
      let lectureId = item.lectureId
      let content = !shareFlag ? '讲义分享成功后将添加至讲义库，确认分享?' : '确认取消?'
      let title = !shareFlag ? '分享讲义' : '取消分享'
      let successTip = !shareFlag ? '分享成功' : '取消分享成功'
      let errorTip = !shareFlag ? '分享失败' : '取消分享失败'

      this.$confirm(content, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.shareLecture(lectureId).then(res => {
            if (res.success) {
              this.getLectureList(this.formInline)
              this.$message({
                type: 'success',
                message: res.message || successTip
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.message || errorTip
              })
            }
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消操作' })
        })
    },
    copy(index) {
      let lectureId = this.tableData[index].lectureId
      this.$confirm('将复制一份副本到我的讲义，确认继续?', '复制讲义', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api
            .copyLecture({ lectureId: lectureId, source: 'MY_LECTURE' })
            .then(res => {
              if (res.success) {
                this.getLectureList(this.formInline)
                this.$message({
                  type: 'success',
                  message: res.message || '复制成功'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.message || '复制失败'
                })
              }
            })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消复制' })
        })
    },
    publish(index) {
      let lectureId = this.tableData[index].lectureId
      this.$confirm('发布讲义之后无法回退哟，确认继续?', '发布讲义', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.publishLecture({ lectureId: lectureId }).then(res => {
            if (res.success) {
              this.getLectureList(this.formInline)
              this.$message({ type: 'success', message: res.message || '发布成功' })
            } else {
              this.$message({ type: 'warning', message: res.message || '发布失败' })
            }
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消发布' })
        })
    },
    filterArrayByKey(arr, key) {
      let record = arr.find(v => v.key === key)
      if (record) {
        let arr = [...record.list]
        arr.shift()
        return arr
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="less">
.lecture-index {
  .tab {
    margin-bottom: 20px;
    // display: flex;
    span {
      border-radius: 4px;
      padding: 6px 12px;
      background: #fff;
      margin-right: 10px;
      cursor: pointer;
      .sidebar__sub-icon {
        background: #ddd;
        position: relative;
        top: -1px;
      }
      i.active {
        background: #409eff;
      }
    }
  }
  .table-list-operator {
    margin-bottom: 16px;
    height: 32px;
    display: flex;
    justify-content: space-between;
  }
  .table-pagination {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
