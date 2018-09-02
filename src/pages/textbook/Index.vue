<template>
  <div>
    <!-- 筛选器 -->
    <search-bar v-model="searchKey" @search="search" class="mb-20" placeholder-text="请输入教材名称"/>
    <topic-selector @change="changeSelector" type="TEXTBOOK" />
    <!-- 列表 -->
    <textbook-list :data="list" />

    <!-- 分页 -->
    <div class="text-right mt-20" v-if="pageTotal > 0">
      <el-pagination class="hi" background :current-page="currentPage" @current-change="changePage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import TopicSelector from '@/components/topicSelector/Index'
import SearchBar from '@/components/searchBar/Index'
import TextbookList from './List'
import { textbook } from '@/api'
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      selectedResult: {},
      searchKey: '',
      searchBtnLoading: false
    }
  },
  created() {
    this.getTextbookList()
  },
  computed: {
    userSgr() {
      return this.$store.state.user.userSgr
    }
  },
  methods: {
    async getTextbookList({ currentPage = 1, pageSize = 10, ...params } = {}) {
      try {
        let res = await textbook.list.get({ currentPage, pageSize, ...params })
        this.list = res.data.list
        this.pageTotal = res.data.total
      } catch (e) {}
    },
    changeSelector(val) {
      this.selectedResult = val
      this.getTextbookList({ ...val, searchKey: this.searchKey })
    },
    changePage(currentPage) {
      this.getTextbookList({
        currentPage,
        ...this.selectedResult,
        searchKey: this.searchKey
      })
    },
    async search(val) {
      this.searchKey = val
      this.searchBtnLoading = true
      await this.getTextbookList({
        ...this.selectedResult,
        searchKey: this.searchKey
      })
      this.searchBtnLoading = false
    }
  },
  watch: {
    userSgr(val) {
      this.getTextbookList()
    }
  },
  components: {
    TopicSelector,
    TextbookList,
    SearchBar
  }
}
</script>

<style lang="less">
@import url(./Textbook.less);
</style>
