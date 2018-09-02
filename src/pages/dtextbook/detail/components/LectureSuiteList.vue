<template>
  <div>
    <v-empty :btns="emptyBtns" tip="暂无内容，请先去创建讲义套件资料~~" v-if="tableData.length === 0" />
    <template v-else>
      <div>
        <el-button type="primary" size="small" @click="getLectureSuiteDetail">创建讲义套件</el-button>
      </div>
      <div class="scorll-box scorll-box--lecturesuite">
        <v-table border :data="tableData" :columns="columns" header-row-class-name="m-table-hd" class="m-table mt-20" />
        <div class="mt-20 text-center" v-if="pageTotal > 0">
          <el-pagination background layout="total, prev, pager, next" @current-change="changePage" :current-page.sync="currentPage" :page-size="+pageSize" :total="pageTotal">
          </el-pagination>
        </div>
      </div>
    </template>
    <v-dialog :visible.sync="visible" :data="templateList" :title="lectureSuiteName" :type="type" :create="create" />
  </div>
</template>

<script>
import vTable from '@/components/table'
import vEmpty from './Empty'
import { textbook, lecture } from '@/api'
import columns from './lecture-suite-list-columns'
import vDialog from './CreateLectureSuiteDialog'
export default {
  components: {
    vTable,
    vEmpty,
    vDialog
  },
  inject: ['currentChapter', 'textbookId'],
  data() {
    return {
      emptyBtns: [
        {
          name: '立即创建',
          clickHandler: () => {
            this.getLectureSuiteDetail()
          }
        }
      ],
      columns: columns(this),
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      visible: false,
      templateList: [],
      lectureSuiteName: '',
      type: 'create'
    }
  },
  created() {
    this.getLectureList()
  },
  watch: {
    'currentChapter.id': 'getLectureList'
  },
  methods: {
    async getLectureList() {
      let res = await textbook.getLectureList(
        this.currentChapter.id,
        this.pageSize,
        this.currentPage
      )
      this.tableData = res.data.list || []
      this.pageTotal = res.data.total
    },
    changePage() {
      this.getLectureList()
    },
    async getLectureSuiteDetail() {
      try {
        let res = await textbook.getLectureSuiteDetail(
          this.textbookId,
          this.currentChapter.id
        )
        this.lectureSuiteName = res.data.name
        this.templateList = res.data.templateList || []
        this.type = 'create'
        this.visible = true
      } catch (e) {
        this.$message.error(e)
      }
    },
    async create(val) {
      if (val.length === 0) return this.$message.error('讲义套件模块不能为空！')
      try {
        await textbook.createLectureSuiteToChapter({
          name: this.lectureSuiteName,
          templateList: val,
          textbookId: this.textbookId,
          textbookChapterId: this.currentChapter.id
        })
        this.visible = false
        this.getLectureList()
      } catch (e) {
        this.$message.error(e)
      }
    },
    async viewLectureSuiteDetail(data) {
      try {
        let res = await lecture.getLectureSuiteDetail(data.lecturesuitId)
        this.lectureSuiteName = res.data.name
        this.templateList = res.data.templateList || []
        this.type = 'view'
        this.visible = true
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style lang="less">
.scorll-box{
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0;
  }
  &--lecturesuite{
    height: ~'calc(100vh - 360px)';
  }
}
</style>
