<template>
  <div class="my-paper">
    <div class="tab">
      <span @click.prevent="gotoMyLecture">
        <i class="sidebar__sub-icon"></i>我的讲义</span>
      <span @click.prevent="gotoKnowledgeImport">
        <i class="sidebar__sub-icon"></i>我的知识引入</span>
      <span @click.prevent="gotoKnowledgeSummary">
        <i class="sidebar__sub-icon"></i>我的知识总结</span>
      <span @click.prevent="gotoKnowledgeSuite">
        <i class="sidebar__sub-icon"></i>讲义套件</span>
      <span>
        <i class="sidebar__sub-icon active"></i>我的试卷</span>
    </div>
    <search-bar v-model="searchKey" @search="search" class="mb-20" placeholder-text="请输入试卷名称" />
    <!-- 筛选器 -->
    <topic-selector @change="changeSelector" :type="'PAPER_QUERY'" ref="topicSelector" />
    <!-- 试卷表格列表 -->
    <div class="paper-list shadow" v-if="tableData && tableData.length > 0">
      <el-table :data="tableData" border style="width: 100%;" class="hi" v-loading="tableLoading">
        <el-table-column prop="paperName" label="试卷名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sourceDepartment" label="来源部门" width="100">
        </el-table-column>
        <el-table-column prop="year" label="年份" width="100">
        </el-table-column>
        <el-table-column prop="region" label="地区" width="120">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="120">
        </el-table-column>
        <el-table-column prop="productName" label="产品线" width="120">
        </el-table-column>
        <el-table-column prop="paperType" label="类型" width="120">
        </el-table-column>
        <el-table-column label="操作" width="190" align="left">
          <template slot-scope="scope">
            <el-tooltip effect="blue" content="查看" placement="top">
              <button class="m-table-btn__operate" @click.prevent="view(scope.row.id)">
                <i class="iconfont icon-See"></i>
              </button>
            </el-tooltip>
            <el-tooltip effect="blue" :content="scope.row.shareFlag?'取消分享':'分享'" placement="top" v-if="scope.row.status === 'AVAILABLE'">
              <button class="m-table-btn__operate" @click="share(scope.$index)">
                <i class="iconfont" :class="[!scope.row.shareFlag?'icon-share':'icon-Cancellation_of_sharing']"></i>
              </button>
            </el-tooltip>
            <!-- <el-tooltip effect="blue" v-if="scope.row.status !== 'FINISHED'" content="编辑" placement="top">
              <button class="m-table-btn__operate" @click.prevent="edit(scope.row.id)">
                <i class="iconfont icon-edit"></i>
              </button>
            </el-tooltip> -->
            <el-tooltip effect="blue" v-if="scope.row.status !== 'AVAILABLE'" content="发布" placement="top">
              <button class="m-table-btn__operate" @click.prevent="publish(scope.row.id)">
                <i class="iconfont icon-Release"></i>
              </button>
            </el-tooltip>
            <el-tooltip effect="blue" v-if="scope.row.status !== 'AVAILABLE'" content="删除" placement="top">
              <button class="m-table-btn__operate is-delete" @click.prevent="remove(scope.$index)">
                <i class="iconfont icon-delete_1"></i>
              </button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="text-right mt-20" v-if="pageTotal > 0">
        <el-pagination class="hi" background :current-page="currentPage" @current-change="changePage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { paper } from '@/api'
import TopicSelector from '@/components/topicSelector/Index'
import SearchBar from '@/components/searchBar/Index'
export default {
  data() {
    return {
      selectorData: [],
      selectedResult: {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableLoading: false,
      searchKey: '',
      searchBtnLoading: false
    }
  },
  mounted() {
    this.initData()
  },
  computed: {
    userSgr() {
      return this.$store.state.user.userSgr
    }
  },
  methods: {
    initData() {
      this.getPaperList()
    },
    // 获取试卷列表数据
    async getPaperList({ currentPage = 1, pageSize = 10, ...params } = {}) {
      this.tableLoading = true
      try {
        let res = await paper.getMyPaperList({
          currentPage,
          pageSize,
          ...params
        })
        this.pageTotal = res.data.total
        this.tableData = res.data.list
      } catch (e) {
        this.$message.error(e)
      }
      this.tableLoading = false
    },
    changeSelector(val) {
      this.selectedResult = val
      this.getPaperList({ ...val, searchKey: this.searchKey })
    },
    changePage(currentPage) {
      this.getPaperList({
        currentPage,
        ...this.selectedResult,
        searchKey: this.searchKey
      })
    },
    async search(val) {
      this.searchKey = val
      this.searchBtnLoading = true
      await this.getPaperList({
        ...this.selectedResult,
        searchKey: this.searchKey
      })
      this.searchBtnLoading = false
    },
    view(id) {
      this.$router.push({ name: 'my_paper_detail', params: { id } })
    },
    edit(id) {
      this.$router.push({ name: 'my_paper_detail', params: { id } })
    },
    async remove(index) {
      const id = this.tableData[index].id
      try {
        await this.$confirm('将删除该份试卷，是否继续？')
        await paper.delPaper(id)
        this.tableData.splice(index, 1)
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    async share(index) {
      let msg1 = '分享该份试卷，操作后将被添加到试卷库，是否继续？'
      let msg2 = '取消分享该份试卷，操作后将从试卷库中移除，是否继续？'
      const msg = this.tableData[index].shareFlag ? msg2 : msg1
      try {
        await this.$confirm(msg)
        const id = this.tableData[index].id
        await paper.sharePaper(id)
        this.tableData[index].shareFlag = !this.tableData[index].shareFlag
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    async publish(id) {
      try {
        await this.$confirm('将发布该份试卷，发布后不能编辑，是否继续？')
        await paper.publishPaper(id)
        await this.getPaperList({
          ...this.selectedResult,
          searchKey: this.searchKey
        })
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
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
    gotoKnowledgeSuite() {
      this.$router.push({
        name: 'lecture_suite',
        query: this.$route.query
      })
    }
  },
  watch: {
    userSgr(n, o) {
      if (JSON.stringify(n) !== JSON.stringify(o)) {
        this.getPaperList()
      }
    }
  },
  components: {
    TopicSelector,
    SearchBar
  }
}
</script>

<style lang="less">
@import './paper.less';
.table-btn-group__popper {
  width: auto;
  background: #fff;
}
.my-paper {
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
</style>
