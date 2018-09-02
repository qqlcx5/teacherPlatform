<template>
  <el-dialog title="添加试题" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" class="m-add-qu-dialog" center>
    <div class="search-box">
      <v-search-bar @search="handleSearch" v-model="searchKey" :placeholder-text="searchBarPlaceholderTxt" class="mr-20" />
      <el-radio-group v-model="searchType">
        <el-radio label="STEM">按题干搜索</el-radio>
        <el-radio label="TAG">按标签搜索</el-radio>
        <el-radio label="SOURCE_TAG">按来源标签搜索</el-radio>
      </el-radio-group>
    </div>
    <div class="filter-box mt-20">
      <v-topic-selector @change="handleFilter" type="ITEM" style="--grid-columns: 4;" />
    </div>
    <div class="qu-list">
      <v-question :data="item" :idx="item.showNo||(index+1)" v-for="(item,index) in list" :key="item.itemId" @add-qu="addQu"/>
    </div>
    <div class="text-right mt-20" v-if="pageTotal > 0">
      <el-pagination class="hi" background :current-page="currentPage" @current-change="changePage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button type="primary" size="small"  @click="handleClose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import vSearchBar from '@/components/searchBar/Index'
import vTopicSelector from '@/components/topicSelector/Index'
import vQuestion from './question'
import { lecture } from '@/api'
export default {
  components: {
    vSearchBar,
    vTopicSelector,
    vQuestion
  },
  props: {
    visible: Boolean,
    lectureId: String,
    pointId: String
  },
  data() {
    return {
      searchType: 'STEM',
      list: [],
      currentPage: 1,
      pageTotal: 0,
      searchKey: '',
      filterResult: {}
    }
  },
  computed: {
    searchBarPlaceholderTxt() {
      const str = {
        STEM: '请输入题干的关键词',
        TAG: '请输入标签的关键词',
        SOURCE_TAG: '请输入来源标签的关键词'
      }
      return str[this.searchType]
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getQuestionList()
      }
    },
    searchType(val) {
      this.getQuestionList({
        ...this.filterResult,
        pointId: this.pointId,
        searchKey: this.searchKey,
        searchType: val
      })
    }
  },
  methods: {
    // 获取试卷列表数据
    async getQuestionList({ currentPage = 1, pageSize = 10, ...params } = {}) {
      try {
        let res = await lecture.getLectureItemList({ currentPage, pageSize, ...params, lectureId: this.lectureId, pointId: this.pointId })
        this.pageTotal = res.data.total
        this.list = res.data.list
        this.currentPage = res.data.currentPage
      } catch (e) {
        this.$message.error(e)
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSearch(val) {
      this.searchKey = val
      this.getQuestionList({
        ...this.filterResult,
        searchKey: this.searchKey,
        searchType: this.searchType
      })
    },
    handleFilter(val) {
      this.filterResult = val
      this.getQuestionList({
        ...this.filterResult,
        searchKey: this.searchKey,
        searchType: this.searchType
      })
    },
    changePage(val) {
      this.currentPage = val
      this.getQuestionList({
        currentPage: this.currentPage,
        ...this.filterResult,
        searchKey: this.searchKey,
        searchType: this.searchType
      })
    },
    addQu(val) {
      this.$emit('add-qu', val)
      // try {
      //   await lecture.addLectureQu({
      //     itemId: val.itemId,
      //     lectureId: this.lectureId,
      //     pointId: this.pointId
      //   })
      //   val.addFlag = true
      //   this.$emit('add-qu', val)
      // } catch (e) {
      //   this.$message.error(e)
      // }
    }
  }
}
</script>

<style lang="less">
.m-add-qu-dialog {
  .search-box {
    display: flex;
    align-items: center;
  }
}
</style>
