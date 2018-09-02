<template>
  <div>
    <div class="mb-20 headerSearch">
      <search-bar v-model="searchKey" @search="search" placeholder-text="请输入教材名称" />
      <el-button type="primary" size="small" @click="openTextbookDialog">新建教材</el-button>
    </div>
    <topic-selector @change="changeSelector" type="DOUBLE_TEACHER_TEXTBOOK" />
    <section class="tb-list g-mt">
      <v-item v-for="item in tableData" :key="item.id" :data="item" @remove="remove(item.id)" />
    </section>
    <div class="text-right mt-20" v-if="pageTotal > 0">
      <el-pagination background :current-page="currentPage" @current-change="changePage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
      </el-pagination>
    </div>
    <add-textbook-basic-info-dialog :visible.sync="diaLogVisible" :year-list="yearList" :course-list="courseList" :version-list="versionList" :level-list="levelList" :period-list="periodList" :grade-list="gradeList"></add-textbook-basic-info-dialog>
  </div>
</template>

<script>
import { app, textbook } from '@/api'
import SearchBar from '@/components/searchBar/Index'
import AddTextbookBasicInfoDialog from '../detail/components/AddTextbookBasicInfoDialog'
import TopicSelector from '@/components/topicSelector/Index'
import vItem from './item'
export default {
  name: 'DTextbookList',
  components: {
    SearchBar,
    vItem,
    AddTextbookBasicInfoDialog,
    TopicSelector
  },
  data() {
    return {
      yearList: [],
      periodList: [],
      gradeList: [],
      courseList: [],
      levelList: [],
      versionList: [],
      searchKey: '',
      filterResult: {},
      selectedResult: {},
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      loading: false,
      diaLogVisible: false,
      tableData: []
    }
  },
  created() {
    this.getTextbookList()
    // 获取相关字典列表
    this.getDictList()
  },
  computed: {},
  methods: {
    getDictList() {
      app.selector.get('DOUBLE_TEACHER_TEXTBOOK').then(resp => {
        let resList = resp.data
        let keyMap = {}
        resList.forEach(element => {
          keyMap[element.key] = element.list
        })
        this.yearList = keyMap.yearId
        this.gradeList = keyMap.gradeId
        this.courseList = keyMap.seasonId
        this.versionList = keyMap.textbook_version_id
        this.levelList = keyMap.textbook_level_id
      })
      app.selector.get('BASE').then(resp => {
        let resList = resp.data
        let keyMap = {}
        resList.forEach(element => {
          keyMap[element.key] = element.list
        })
        this.periodList = keyMap.periodId
      })
    },
    openTextbookDialog() {
      this.diaLogVisible = true
    },
    // 获取教材列表数据
    async getTextbookList({ currentPage = 1, pageSize = 10, ...params } = {}) {
      try {
        let res = await textbook.list.get({
          currentPage,
          pageSize,
          textbookType: 'DOUBLE_TEACHER',
          ...params
        })
        this.tableData = res.data.list
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
    },
    // 删除教材
    async remove(templateId) {
      try {
        await this.$confirm('此操作将永久删除该文件,是否继续？')
        await textbook.removeTextbook(templateId)
        this.getTextbookList()
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    }
  }
}
</script>
<style lang="less">
//  @import "@/assets/less/variables.css";
.headerSearch {
  display: flex;
  justify-content: space-between;
}
.tb-list {
  --label-width: 60px;
  --grid-gap: 20;
  --grid-columns: 5;
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  grid-gap: ~"calc(var(--grid-gap) * 1px)";
   @media (max-width: 1920px) {
    --grid-columns: 5;
  }
  @media (max-width: 1600px) {
    --grid-columns: 4;
  }
  @media (max-width: 1440px) {
    --grid-columns: 3;
  }
}
</style>
