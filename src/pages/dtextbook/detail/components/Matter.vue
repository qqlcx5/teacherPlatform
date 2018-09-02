<template>
  <div>
    <el-tabs class="hi-tabs" v-model="activeName" type="card" @tab-click="handleClick" style="height: 100%; display: flex; flex-direction: column;">
      <el-tab-pane label="素材列表" name="resource" class="scroll-box scroll-box--matter">
        <v-material />
      </el-tab-pane>
      <el-tab-pane label="题目列表" name="question" class="scroll-box scroll-box--matter">
        <v-empty v-if="tableData.length === 0" :btns="emptyBtns" tip="暂无题目，请先添加题目" />
        <template v-else>
          <div>
            <el-button type="primary" size="small" @click="openDialog">添加题目</el-button>
            <el-button type="primary" size="small" @click="associate">关联题目</el-button>
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="refresh" v-show="editItemStatus">刷新</el-button>
          </div>
          <v-table
            :data="tableData"
            border
            style="width: 100%"
            header-row-class-name="m-table-hd"
            class="m-table mt-20 material-table"
            :columns="columns" />
          <div class="mt-20 text-center" v-if="pageTotal > 0">
            <el-pagination background layout="total, prev, pager, next" @current-change="changePage" :current-page.sync="currentPage" :page-size="+pageSize" :total="pageTotal">
            </el-pagination>
          </div>
        </template>
        <v-associate-dialog
          v-if="visible"
          :visible.sync="visible"
          @on-success="addMaterialSuccess"
          @view-question-detail="viewQuestionDetail" />
        <v-question-detail-dialog
          :visible.sync="showCurrentItem"
          :data="currentItem"
          @close="showCurrentItem = false" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import vMaterial from './Material'
import vEmpty from './Empty'
import vTable from '@/components/table'
import columns from './question-columns'
import vAssociateDialog from './associate-dialog'
import vQuestionDetailDialog from '@/components/item-detail-dialog'
import { dtextbook } from '@/api'
// import vQuestionWrapper from './Question'
// import { itemColumnsList } from './tableColumn'

export default {
  name: 'Matter',
  components: {
    vMaterial,
    vEmpty,
    vTable,
    vAssociateDialog,
    vQuestionDetailDialog
  },
  inject: ['currentChapter', 'textbookId'],
  computed: {
    manageUrl() {
      return this.$store.state.app.manageUrl
    }
  },
  data() {
    return {
      activeName: 'resource',
      emptyBtns: [
        {
          name: '添加题目',
          clickHandler: () => {
            this.addQu()
          }
        },
        {
          name: '关联题目',
          clickHandler: () => {
            this.associate()
          }
        }
        // {
        //   name: '刷新',
        //   clickHandler: () => {
        //     this.refresh()
        //   }
        // }
      ],
      tableData: [],
      columns: columns(this),
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      visible: false,
      currentItem: {},
      showCurrentItem: false,
      editItemStatus: false
    }
  },
  watch: {
    'currentChapter.id': 'getMatterialLibraryItemsList'
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    },
    addMaterialSuccess() {
      this.getMatterialLibraryItemsList()
    },
    addQu() {
      // TODO: 这里如何跳转？？？
      window.open(this.manageUrl + `/#/paper/add?type=twp&textbookChapterId=${this.currentChapter.id}`)
    },
    associate() {
      this.visible = true
    },
    async viewQuestionDetail(itemId) {
      try {
        let res = await dtextbook.getQuDetail(itemId)
        if (res.success) {
          this.showCurrentItem = true
          this.currentItem = res.data
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    async getMatterialLibraryItemsList() {
      try {
        let res = await dtextbook.getMatterialLibraryItemsList({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          textbookChapterId: this.currentChapter.id
        })
        this.tableData = res.data.list || []
        this.currentPage = res.data.currentPage
        this.pageTotal = res.data.total
        // 隐藏刷新按钮
        this.editItemStatus = false
      } catch (e) {
        this.$message.error(e)
      }
    },
    async removeDTextbookMaterial(data) {
      try {
        await this.$confirm('操作删除该题目，是否继续?', {type: 'warning'})
        await dtextbook.delMatterialLibraryItem(data.chapterMaterialId)
        const idx = this.tableData.findIndex(v => v.chapterMaterialId === data.chapterMaterialId)
        idx > -1 && this.tableData.splice(idx, 1)
        this.$message.success('删除成功')
        this.refresh()
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    async editDTextbookMaterial(data) {
      try {
        await this.$confirm('编辑题目后，请记得返回该界面点击上方的刷新按钮?', {type: 'warning'})
        this.editItemStatus = true
        window.open(this.manageUrl + `/#/item/${data.itemId}/edit?type=edit`)
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    viewDTextbookMaterial(data) {
      this.viewQuestionDetail(data.itemId)
    },
    openDialog() {
      window.open(this.manageUrl + `/#/paper/add?type=twp&textbookChapterId=${this.currentChapter.id}`)
    },
    changePage() {
      this.getMatterialLibraryItemsList()
    },
    async refresh() {
      try {
        await this.getMatterialLibraryItemsList()
        this.editItemStatus = false
      } catch (e) {
        this.$message.error(e)
      }
    }
  },
  mounted() {
    this.getMatterialLibraryItemsList()
  }
}
</script>

<style lang="less">
.scroll-box{
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0
  }
  &--matter{
    height: ~'calc(100vh - 378px)';
  }
}
</style>
