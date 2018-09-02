<template lang="html">
  <div class="lecture-index">
    <el-card>
      <div class="standard-table">
        <p class="mt-0 mr-10 text-right">共{{ total || 0 }}份讲义</p>
        <el-table class="hi" border :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="讲义名称"></el-table-column>
          <el-table-column prop="gradeName" label="年级" width="140"></el-table-column>
          <el-table-column prop="courseTypeName" label="课程类型" width="140"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="160"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-tooltip effect="blue" content="编辑" placement="top">
                <button class="m-table-btn__operate" @click.prevent="edit(scope.$index)"><i class="iconfont icon-edit"></i></button>
              </el-tooltip>
              <el-tooltip effect="blue" content="删除" placement="top">
                <button class="m-table-btn__operate is-delete" @click.prevent="handleDeleteDialog(scope.$index)"><i class="iconfont icon-delete_1"></i></button>
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
import api from '@/api/lecture'
export default {
  name: 'LectureDraftList',
  data () {
    return {
      formInline: {
        name: '',
        currentPage: 1,
        pageSize: 10,
        initFlag: true
      },
      tableData: [],
      total: 0
    }
  },
  computed: {
    userSgr() {
      return this.$store.state.user.userSgr
    }
  },
  mounted () {
    this.getLectureList(this.formInline)
  },
  watch: {
    userSgr(val) {
      this.getLectureList(this.formInline)
    }
  },
  methods: {
    getLectureList (params) {
      api.lectureList(params).then(res => {
        if (res.success) {
          this.$message({ message: res.message || '请求成功', type: 'success' })
          this.tableData = res.data.list || []
          this.total = res.data.total || 0
        }
      })
    },
    initPageSize () {
      this.formInline.pageSize = 10
    },
    initCurrentPage () {
      this.formInline.currentPage = 1
    },
    handleSizeChange (val) {
      this.formInline.pageSize = val
      this.getLectureList(this.formInline)
    },
    handleCurrentChange (val) {
      this.formInline.currentPage = val
      this.getLectureList(this.formInline)
    },
    handleDeleteDialog (index) {
      let id = this.tableData[index].id
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLecture(id)
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    deleteLecture (id) {
      api.deleteLeture(id)
        .then((resp) => {
          this.$message({ type: 'success', message: '删除成功' })
          this.getLectureList(this.formInline)
        }, () => {
          this.$message({ type: 'error', message: '删除失败' })
        })
    },
    edit (index) {
      let lectureId = this.tableData[index].lectureId
      this.$router.push({
        name: 'groupLecture',
        params: {
          lectureId: lectureId
        },
        query: {
          source: 'draft'
        }
      })
    }
  }
}
</script>

<style lang="less">
  .lecture-index {
    .table-list-operator {
      margin-bottom: 16px;
    }
    .table-pagination {
      margin-top: 24px;
      text-align: right;
    }
    .mt-0 {
      margin-top: 0px;
    }
  }
</style>
