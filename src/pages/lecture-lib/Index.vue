<template lang="html">
  <div class="lecture-lib-index">
    <div class="table-list-form">
      <search-bar v-model="searchKey" @search="onSubmit" class="mb-20 mr-20" placeholder-text="请输入讲义名称"/>
    </div>
    <div class="">
      <topic-selector @change="changeSelector" type="LECTURE_LIB" ref="topicSelector" />
    </div>
    <el-card>
      <div class="table-list-operator">
        <p class="text-right mr-10">共{{ total || 0 }}份讲义</p>
      </div>
      <div class="standard-table">
        <el-table class="hi" border :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="讲义名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productName" label="产品线" width="120">
          </el-table-column>
          <el-table-column prop="gradeName" label="年级" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseTypeName" label="课程类型" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="regionName" label="地区" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shareUserName" label="分享人" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="replicaNum" label="复制次数" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="170" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-tooltip effect="blue" content="查看" placement="top">
                <button class="m-table-btn__operate" @click.prevent="preview(scope.$index)"><i class="iconfont icon-See"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" content="复制" placement="top">
                <button class="m-table-btn__operate" @click.prevent="copy(scope.$index)"><i class="iconfont icon-copy"></i></button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="formInline.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="formInline.pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import TopicSelector from '@/components/topicSelector/Index'
import SearchBar from '@/components/searchBar/Index'
import api from '@/api/lecture'
export default {
  name: 'lectureIndex',
  components: { TopicSelector, SearchBar },
  data() {
    return {
      formInline: {
        name: '',
        currentPage: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      searchKey: ''
    }
  },
  mounted() {
    const params = {
      name: '',
      currentPage: 1,
      pageSize: 10
    }
    this.getLectureList(params)
  },
  computed: {
    userSgr() {
      return this.$store.state.user.userSgr
    }
  },
  watch: {
    userSgr(val) {
      this.getLectureList(this.formInline)
    }
  },
  methods: {
    getLectureList(params) {
      api.getLectureLibList(params).then(res => {
        if (res.success) {
          this.$message({ message: res.message || '请求成功', type: 'success' })
          this.tableData = res.data.list || []
          this.total = res.data.total || 0
        }
      })
    },
    onSubmit(val) {
      this.formInline.name = val
      this.initPageSize()
      this.initCurrentPage()
      this.getLectureList(this.formInline)
    },
    initPageSize() {
      this.formInline.pageSize = 10
    },
    initCurrentPage() {
      this.formInline.currentPage = 1
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getLectureList(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.currentPage = val
      this.getLectureList(this.formInline)
    },
    handleDeleteDialog(id) {
      this.$confirm('此操作将永久删除该文件，是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteLecture(id)
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    changeSelector(data) {
      this.formInline = Object.assign({}, this.formInline, { ...data })
      this.getLectureList(this.formInline)
    },
    preview(index) {
      let lectureId = this.tableData[index].lectureId
      this.$router.push({
        name: 'LectureLib_detail',
        params: {
          lectureId: lectureId
        },
        query: {...this.$route.query, type: 'view'}
      })
    },
    copy(index) {
      let lectureId = this.tableData[index].lectureId
      this.$confirm('将复制一份副本到我的讲义，确认继续?', '复制讲义', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api
            .copyLecture({ lectureId: lectureId, source: 'LECTURE_LIB' })
            .then(res => {
              if (res.success) {
                this.getLectureList(this.formInline)
              } else {
                this.$message({ type: 'warning', message: '复制失败' })
              }
            })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消复制' })
        })
    }
  }
}
</script>

<style lang="less">
.lecture-lib-index {
  .table-list-operator {
    margin-bottom: 16px;
    justify-content: flex-end;
    p {
      margin: 0px;
    }
  }

  .standard-table {
    .sidebar__sub-icon {
      background: #409eff;
    }
  }
  .table-pagination {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
