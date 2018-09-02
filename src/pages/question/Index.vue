<template>
  <div class="p-question">
    <div class="question-side shadow">
      <div class="question-side__hd">
        <span>知识树</span>
      </div>
      <div class="question-side__bd">
        <knowledge-tree :grade-id="selectedResult.gradeId" @change="changeKnowledgeTree" ref="knowledgeTree"/>
      </div>
    </div>
    <div class="question-main">
      <search-bar @search="search" v-model="searchKey" class="mb-20 mr-20" :placeholder-text="searchType==='STEM'?'请输入题干内容':'请输入标签名称'"/>
      <el-radio v-model="searchType" label="STEM">按题干搜索</el-radio>
      <el-radio v-model="searchType" label="TAG">按标签搜索</el-radio>
      <el-radio v-model="searchType" label="SOURCE_TAG">按来源标签搜索</el-radio>
      <!-- 筛选器 -->
      <topic-selector @change="changeSelector" type="ITEM" style="--grid-columns: 5;"/>
      <div class="question-list shadow">
        <div class="question-list__total">共计：{{pageTotal}}题</div>
        <v-question class="mt-30" :idx="item.showNo || index + 1" :data="item" v-for="(item, index) in list" :key="item.itemId" @handler-correct="handlerCorrect"/>
        <!-- <question-item :data="item" v-for="item in list" :key="item.itemId" style="margin-bottom: 20px;" >
          <span slot="top-button-field">
            <el-button size="small" @click="showCorrect(item)" style="position: absolute;right:20px;top:10px">纠错</el-button>
          </span>
        </question-item> -->
        <!-- 分页 -->
        <div class="text-right mt-20" v-if="pageTotal > 0">
          <el-pagination class="hi" background :current-page="currentPage" @current-change="changePage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopicSelector from '@/components/topicSelector/Index'
import SearchBar from '@/components/searchBar/Index'
import KnowledgeTree from '@/components/knowledgeTree/Index'
// import QuestionItem from './Item'
import { question } from '@/api'
import correctDialog from '../../components/correct-dialog'
import vQuestion from './qu'
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      selectedResult: {},
      knowledgeId: '',
      searchKey: '',
      searchBtnLoading: false,
      searchType: 'STEM',
      sourceDepartmentId: ''
    }
  },
  mounted() {
    this.getQuestionList()
  },
  computed: {
    userSgr() {
      return this.$store.state.user.userSgr
    }
  },
  methods: {
    // 获取试卷列表数据
    async getQuestionList({ currentPage = 1, pageSize = 10, ...params } = {}) {
      try {
        let res = await question.list.get({ currentPage, pageSize, ...params })
        this.pageTotal = res.data.total
        this.list = res.data.list
        this.currentPage = res.data.currentPage
      } catch (e) {
        this.$message.error(e)
      }
    },
    changeSelector(val) {
      this.selectedResult = val
      this.getQuestionList({
        ...this.selectedResult,
        pointId: this.knowledgeId,
        searchKey: this.searchKey,
        searchType: this.searchType
      })
    },
    changeKnowledgeTree(val) {
      this.knowledgeId = val.nodeId
      this.getQuestionList({
        ...this.selectedResult,
        pointId: this.knowledgeId,
        searchKey: this.searchKey,
        searchType: this.searchType
      })
    },
    changePage(currentPage) {
      this.getQuestionList({
        currentPage,
        ...this.selectedResult,
        pointId: this.knowledgeId,
        searchKey: this.searchKey,
        searchType: this.searchType
      })
    },
    async search(val) {
      this.searchKey = val
      this.searchBtnLoading = true
      await this.getQuestionList({
        ...this.selectedResult,
        pointId: this.knowledgeId,
        searchKey: this.searchKey,
        searchType: this.searchType
      })
      this.searchBtnLoading = false
    },
    async showCorrect(data) {
      let res = await question.getQuDetail(data.itemId)
      if (!res.success) return false
      if (res.data && res.data.status === 'AVAILABLE') {
        correctDialog({visible: true, itemDetail: data}).$on('success', () => {
          this.getQuestionList()
        })
      } else {
        this.$message.error('该题目未启用，暂无法纠错！')
      }
    },
    handlerCorrect() {
      this.getQuestionList()
    }
  },
  watch: {
    userSgr(val) {
      this.$refs['knowledgeTree'].getKnowledge()
      this.getQuestionList()
    },
    searchType(val) {
      this.getQuestionList({
        ...this.selectedResult,
        pointId: this.knowledgeId,
        searchKey: this.searchKey,
        searchType: val
      })
    }
  },
  components: {
    TopicSelector,
    vQuestion,
    KnowledgeTree,
    SearchBar
  }
}
</script>

<style lang="less">
@import url(./Question.less);
.mt-30{
  margin-top: 30px;
}
</style>
