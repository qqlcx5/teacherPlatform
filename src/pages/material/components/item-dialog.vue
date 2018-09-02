<template>
  <div class="item-dialog-wrapper">
    <el-dialog title="添加试题" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" class="m-add-qu-dialog" center>
      <div class="search-box">
        <v-search-bar @search="handleSearch" v-model="queryParams.searchContent" :placeholder-text="searchBarPlaceholderTxt" class="mr-20" />
      </div>
      <div class="qu-list">
        <v-table
          class="v-table"
          ref="v-table"
          :data="list"
          border
          style="width: 100%"
          :columns="columnsList" />
      </div>
      <div class="text-right mt-20" v-if="pageTotal > 0">
        <el-pagination class="hi" background :current-page="queryParams.currentPage" @current-change="changePage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small"  @click="handleClose">确 定</el-button>
      </div>
    </el-dialog>
    <v-question-detail-dialog
      :visible.sync="showCurrentItem"
      :data="currentItem"
      @close="showCurrentItem = false" />
  </div>
</template>

<script>
import vSearchBar from '@/components/searchBar/Index'
import vTable from '@/components/table'
import { dtextbook, question } from '@/api'
import vQuestionDetailDialog from '@/components/item-detail-dialog'
import { itemColumnsList } from './tableColumn'

export default {
  name: 'itemDialogWrapper',
  inject: ['chapterId', 'lectureId'],
  components: {
    vSearchBar,
    vTable,
    vQuestionDetailDialog
  },
  props: {
    visible: Boolean
  },
  data () {
    return {
      queryParams: {
        currentPage: 1,
        pageSize: 10,
        searchContent: '',
        textbookChapterId: this.chapterId,
        lectureId: this.lectureId
      },
      currentItem: {},
      showCurrentItem: false,
      columnsList: itemColumnsList(this),
      list: [],
      pageTotal: 2,
      searchBarPlaceholderTxt: '请输入关键字'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getQuestionList(this.queryParams)
      }
    }
  },
  methods: {
    // 获取试卷列表数据
    async getQuestionList(params) {
      try {
        let res = await dtextbook.getMaterialItems(params)
        this.pageTotal = res.data.total
        this.list = res.data.list
      } catch (e) {
        this.$message.error(e)
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSearch(val) {
      this.queryParams.searchContent = val
      this.getQuestionList(this.queryParams)
    },
    changePage(val) {
      this.queryParams.currentPage = val
      this.getQuestionList(this.queryParams)
    },
    // 查看单题详情
    async view(id) {
      let res = await question.getQuDetail(id)
      if (res.success) {
        this.currentItem = res.data
        this.showCurrentItem = true
        return
      }
      this.$message.error(res.message || '请求失败')
    },
    // 选择该题
    addQu(val) {
      this.$emit('add-qu', val)
    },
    // 取消该题
    delQu(val) {
      this.$emit('del-qu', val)
    }
  }
}
</script>

<style lang="less">
.m-add-qu-dialog {
  .search-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
