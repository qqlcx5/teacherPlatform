<template lang="html">
  <div class="text-dialog">
    <el-dialog title="添加素材" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" class="m-add-qu-dialog" center>
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
    <v-text-detail-dialog
      :visible.sync="showCurrentText"
      :data="currentText"
      @close="closeTextDetailDialog" />
  </div>
</template>

<script>
import vSearchBar from '@/components/searchBar/Index'
import vTable from '@/components/table'
import { dtextbook } from '@/api'
import { textColumnsList } from './tableColumn'
import vTextDetailDialog from '@/pages/dtextbook/detail/components/ViewMaterialDialog.vue'

export default {
  name: 'text-dialog',
  inject: ['chapterId', 'lectureId'],
  components: {
    vSearchBar,
    vTable,
    vTextDetailDialog
  },
  props: {
    visible: Boolean
  },
  watch: {
    visible(val) {
      if (val) {
        this.getTextList(this.queryParams)
      }
    }
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
      showCurrentText: false,
      currentText: null,
      columnsList: textColumnsList(this),
      list: [],
      pageTotal: 2,
      searchBarPlaceholderTxt: '请输入关键字'
    }
  },
  methods: {
    // 获取试卷列表数据
    async getTextList(params) {
      try {
        let res = await dtextbook.getMaterialText(params)
        this.pageTotal = res.data.total
        this.list = res.data.list
        return null
      } catch (e) {
        this.$message.error(e)
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSearch(val) {
      this.queryParams.searchContent = val
      this.getTextList(this.queryParams)
    },
    changePage(val) {
      this.queryParams.currentPage = val
      this.getTextList(this.queryParams)
    },
    // 选中文本材料
    addQu(val) {
      this.$emit('add-qu', val, 'textId')
    },
    delQu(val) {
      this.$emit('del-qu', val)
    },
    view(val) {
      this.currentText = { ...val }
      this.showCurrentText = true
    },
    closeTextDetailDialog() {
      this.currentText = null
      this.showCurrentText = false
    }
  }
}
</script>
