<template>
  <div class="p-dtb-material">
    <v-empty v-if="tableData.length === 0" :btns="emptyBtns" tip="暂无素材，请先添加素材" />
    <template v-else>
      <div>
        <el-button type="primary" size="small" @click="openDialog">添加素材</el-button>
      </div>
      <v-table v-loading="loading" :data="tableData" :columns="columns" header-row-class-name="m-table-hd" class="m-table mt-20 material-table" />
      <div class="mt-20 text-center" v-if="pageTotal > 0">
        <el-pagination background layout="total, prev, pager, next" @current-change="changePage" :current-page.sync="currentPage" :page-size="+pageSize" :total="pageTotal">
        </el-pagination>
      </div>
    </template>
    <v-add-material-dialog :visible.sync="visible" @on-success="addMaterialSuccess" :type="dialogType" :data="selectedMaterialData" />
    <v-view-material-dialog :visible.sync="viewDialogVisible" :data="selectedMaterialData" />
  </div>
</template>

<script>
import vEmpty from './Empty'
import vTable from '@/components/table'
import vAddMaterialDialog from './AddMaterialDialog'
import vViewMaterialDialog from './ViewMaterialDialog'
import columns from './material-columns'
import { textbook } from '@/api'
export default {
  components: {
    vEmpty,
    vTable,
    vAddMaterialDialog,
    vViewMaterialDialog
  },
  inject: ['currentChapter', 'textbookId'],
  data() {
    return {
      emptyBtns: [
        {
          name: '添加素材',
          clickHandler: () => {
            this.openDialog()
          }
        }
      ],
      tableData: [],
      columns: columns(this),
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      visible: false,
      dialogType: 'create',
      selectedMaterialData: {},
      loading: false,
      viewDialogVisible: false
    }
  },
  created() {
    this.getDTextbookMaterialList()
  },
  watch: {
    'currentChapter.id': 'getDTextbookMaterialList'
  },
  methods: {
    async getDTextbookMaterialList() {
      this.loading = true
      try {
        let res = await textbook.getDTextbookMaterialList({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          textbookChapterId: this.currentChapter.id
        })
        this.tableData = res.data.list || []
        this.currentPage = res.data.currentPage
        this.pageTotal = res.data.total
      } catch (e) {
        this.$message.error(e)
      }
      this.loading = false
    },
    changePage() {
      this.getDTextbookMaterialList()
    },
    openDialog() {
      this.selectedMaterialData = {}
      this.dialogType = 'create'
      this.visible = true
    },
    addMaterialSuccess() {
      this.currentPage = 1
      this.getDTextbookMaterialList()
    },
    async removeDTextbookMaterial(data) {
      try {
        await this.$confirm('操作将删除该素材，是否继续?', {type: 'warning'})
        await textbook.removeDTextbookMaterial(data.chapterMaterialId)
        const idx = this.tableData.findIndex(v => v.chapterMaterialId === data.chapterMaterialId)
        idx > -1 && this.tableData.splice(idx, 1)
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    editDTextbookMaterial(data) {
      this.selectedMaterialData = data
      this.dialogType = 'edit'
      this.visible = true
    },
    viewDTextbookMaterial(data) {
      this.selectedMaterialData = data
      this.viewDialogVisible = true
    }
  }
}
</script>

<style lang="postcss">
.material-table img{
  max-width: 300px;
}
.p-dtb-material{
  height: calc(100vh - 378px)
}
</style>
