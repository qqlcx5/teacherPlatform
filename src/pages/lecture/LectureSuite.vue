<template>
  <div>
    <div class="tab">
      <span @click.prevent="gotoMyLecture">
        <i class="sidebar__sub-icon"></i>我的讲义</span>
      <span @click.prevent="gotoKnowledgeImport">
        <i class="sidebar__sub-icon"></i>我的知识引入</span>
      <span @click.prevent="gotoKnowledgeSummary">
        <i class="sidebar__sub-icon"></i>我的知识总结</span>
      <span>
        <i class="sidebar__sub-icon active"></i>讲义套件</span>
      <span @click.prevent="gotoMyPaper">
        <i class="sidebar__sub-icon"></i>我的试卷</span>
    </div>
    <search-bar v-model="searchKey" @search="handleSearch" class="mb-20" placeholder-text="请输入讲义套件名称" />
    <topic-selector @change="changeSelector" type="LECTURE_SUITE" ref="topicSelector" />
    <el-card>
      <el-row type="flex" justify="space-between" class="mb-20">
        <el-col :span="12">
          <el-button size="small" icon="el-icon-plus" type="primary" @click="createLectureSuite">添加讲义套件</el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <span>共{{ total || 0 }}份讲义</span>
        </el-col>
      </el-row>

      <el-table class="hi mb-20" border :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="讲义套件名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="gradeName" label="年级" width="120"></el-table-column>
        <el-table-column prop="courseTypeName" label="课程类型" width="120"></el-table-column>
        <el-table-column prop="productName" label="产品线" width="100"></el-table-column>
        <el-table-column label="讲义状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'ENABLE'">未发布</span>
            <span v-else-if="scope.row.status === 'DISABLED'">已发布</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="220" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="blue" content="预览" placement="top">
              <router-link :to="{name: 'lecture_suite_detail', params: {id: scope.row.id}}">
                <button class="m-table-btn__operate">
                  <i class="iconfont icon-See"></i>
                </button>
              </router-link>
            </el-tooltip>
            <el-tooltip effect="blue" content="复制" placement="top">
              <button class="m-table-btn__operate" @click="copyLectureSuite(scope.row)">
                <i class="iconfont icon-copy"></i>
              </button>
            </el-tooltip>
            <el-tooltip effect="blue" v-if="scope.row.status !== 'DISABLED'" content="编辑" placement="top">
              <router-link :to="{name: 'lecture_suite_edit', params: {id: scope.row.id}}">
                <button class="m-table-btn__operate">
                  <i class="iconfont icon-edit"></i>
                </button>
              </router-link>
            </el-tooltip>
            <el-tooltip effect="blue" v-if="scope.row.status !== 'DISABLED'" content="发布" placement="top">
              <button class="m-table-btn__operate" @click="publishLectureSuite(scope.row)">
                <i class="iconfont icon-Release"></i>
              </button>
            </el-tooltip>
            <el-tooltip effect="blue" v-if="!(scope.row.shareFlag || scope.row.status === 'DISABLED')" content="删除" placement="top">
              <button class="m-table-btn__operate is-delete" @click="delLectureSuite(scope.row)">
                <i class="iconfont icon-delete_1"></i>
              </button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right">
        <el-pagination class="hi" background :current-page="currentPage" @current-change="changePage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </el-card>
    <lecture-suit-dialog :visible.sync="diaLogVisible" :grade-list="gradeList" :course-list="courseList" :product-line-list="productLineList" />
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/Index'
import topicSelector from '@/components/topicSelector/Index'
import lectureSuitDialog from './components/lecture-suite-create-dialog'
import { lecture } from '../../api'
export default {
  components: {
    searchBar,
    topicSelector,
    lectureSuitDialog
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchKey: '',
      selectedResult: {},
      diaLogVisible: false
    }
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
  watch: {
    userSgr(val) {
      this.getLectureSuite()
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getLectureSuite()
    },
    async getLectureSuite({
      currentPage = 1,
      pageSize = 10,
      status = 'FINISHED',
      ...params
    } = {}) {
      try {
        let res = await lecture.getLectureSuite({
          currentPage,
          pageSize,
          status,
          ...params
        })
        this.tableData = res.data.list
        this.currentPage = res.data.currentPage
        this.total = res.data.total
      } catch (e) {
        this.$message.error(e)
      }
    },
    createLectureSuite() {
      this.diaLogVisible = true
    },
    handleSearch(val) {
      this.searchKey = val
      this.getLectureSuite({
        ...this.selectedResult,
        name: this.searchKey
      })
    },
    changeSelector(val) {
      this.selectedResult = val
      this.getLectureSuite({ ...this.selectedResult, name: this.searchKey })
    },
    changePage(currentPage) {
      this.getLectureSuite({
        currentPage,
        ...this.selectedResult,
        name: this.searchKey
      })
    },
    delLectureSuite(item) {
      this.$confirm(
        `确定删除<span style="color:red">${item.name}</span>?`,
        '提示',
        {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then(() => {
          lecture
            .delLectureSuite(item.id)
            .then(() => {
              let idx = this.tableData.findIndex(v => v.id === item.id)
              this.tableData.splice(idx, 1)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    copyLectureSuite(item) {
      this.$confirm(
        `确定复制<span style="color:red">${item.name}</span>?`,
        '提示',
        {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then(() => {
          lecture
            .copyLectureSuite(item.id)
            .then(() => {
              this.getLectureSuite({
                currentPage: this.currentPage,
                ...this.selectedResult,
                name: this.searchKey
              })
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    publishLectureSuite(item) {
      this.$confirm(
        `确定发布<span style="color:red">${item.name}</span>?`,
        '提示',
        {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then(() => {
          lecture
            .pubilshLectureSuite(item.id)
            .then(() => {
              this.getLectureSuite({
                currentPage: this.currentPage,
                ...this.selectedResult,
                name: this.searchKey
              })
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
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
    },
    gotoMyLecture() {
      this.$router.push({
        name: 'lecture_index',
        query: this.$route.query
      })
    },
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
    gotoMyPaper() {
      this.$router.push({
        name: 'my_paper'
      })
    }
  }
}
</script>

<style lang="less">
.tab {
  margin-bottom: 20px;
  display: block;
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
</style>
