<template>
  <div>
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
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
              <el-tooltip effect="blue" content="查看" placement="top">
                <button class="m-table-btn__operate" @click.prevent="preview(scope.$index)"><i class="iconfont icon-See"></i></button>
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
        let res = await paper.list.get({ currentPage, pageSize, ...params })
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
    preview(index) {
      let id = this.tableData[index].id
      this.$router.push({
        name: 'Paper_detail',
        params: {
          id: id
        }
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
</style>
