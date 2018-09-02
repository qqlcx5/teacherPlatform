<template>
  <div>
    <search-bar v-model="searchKey" @search="handleSearch" class="mb-20" placeholder-text="请输入讲义套件名称" />
    <topic-selector @change="changeSelector" type="LECTURE" />
    <el-card>
      <el-row type="flex" justify="space-between" class="mb-20">
        <el-col :offset="12" :span="12" class="text-right">
          <span>共{{ total || 0 }}份讲义</span>
        </el-col>
      </el-row>
      <el-table class="hi mb-20" border :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="讲义名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="productName" label="产品线" width="120">
        </el-table-column>
        <el-table-column prop="gradeName" label="年级" width="140"></el-table-column>
        <el-table-column prop="courseTypeName" label="课程类型" width="140"></el-table-column>
        <el-table-column prop="productName" label="产品线" width="120"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="blue" v-if="scope.row.status !== 'DISABLED'" content="编辑" placement="top">
              <router-link :to="{name: 'groupLecture', params: {lectureId: scope.row.id}, query: {type: 'draft'}}">
                <button class="m-table-btn__operate">
                  <i class="iconfont icon-edit"></i>
                </button>
              </router-link>
            </el-tooltip>
            <el-tooltip effect="blue" content="删除" placement="top">
              <button class="m-table-btn__operate is-delete" @click.prevent="deleteLecture(scope.row)">
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
  </div>
</template>

<script>
import TopicSelector from '@/components/topicSelector/Index'
import SearchBar from '@/components/searchBar/Index'
import { lecture } from '../../../api'
export default {
  components: {
    SearchBar,
    TopicSelector
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      searchKey: '',
      selectedResult: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getLectureList()
    },
    async getLectureList({
      currentPage = 1,
      pageSize = 10,
      initFlag = true,
      ...params
    } = {}) {
      try {
        let res = await lecture.lectureList({
          currentPage,
          pageSize,
          initFlag,
          ...params
        })
        this.tableData = res.data.list
        this.currentPage = res.data.currentPage
        this.total = res.data.total
      } catch (e) {
        this.$message.error(e)
      }
    },
    handleSearch(val) {
      this.searchKey = val
      this.getLectureList({
        ...this.selectedResult,
        name: this.searchKey
      })
    },
    changeSelector(val) {
      this.selectedResult = val
      this.getLectureList({ ...this.selectedResult, name: this.searchKey })
    },
    changePage(currentPage) {
      this.getLectureList({
        currentPage,
        ...this.selectedResult,
        name: this.searchKey
      })
    },
    deleteLecture(item) {
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
            .deleteLeture(item.id)
            .then(() => {
              let idx = this.tableData.findIndex(v => v.id === item.id)
              this.tableData.splice(idx, 1)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    }
  }
}
</script>
