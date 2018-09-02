<template lang="html">
  <el-dialog class="hi-dialog courese-bind-lecture-suite" title="绑定" :visible="visible" width="800px" :before-close="handleClose">
    <div class="lecture-suite-car" :class="{'is-selected': selectedData.id}">
      <span v-if="selectedData.id" :title="selectText">已选讲义套件：{{selectText}}</span>
      <span v-else>未选中任何讲义套件</span>
    </div>
    <el-form :inline="true" :model="searchForm" size="mini" @submit.native.prevent>
      <el-form-item>
        <el-input placeholder="讲义套件名称" v-model="searchForm.name" @keyup.enter.native="seachLectureSuite"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="seachLectureSuite">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table height="222" v-loading="tableLoading" :data="tableData" style="width: 100%;" size="mini">
      <el-table-column width="40">
        <template slot-scope="scope">
          <el-checkbox :value="scope.row.id === selectedData.id" @change="selectedItem(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="讲义套件名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gradeName" label="年级" width="80">
      </el-table-column>
      <el-table-column prop="courseTypeName" label="课程类型" width="100">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="140">
      </el-table-column>
    </el-table>
    <div class="mt-20 text-center">
      <el-pagination background layout="prev, pager, next" :page-size="5" :current-page="currentPage" :total="total" @current-change="changePage">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="handleBind" v-loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { lecture, course } from '../../../../api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      required: true
    },
    gradeId: {
      type: [String, Number],
      required: true
    },
    courseId: {
      type: [String, Number],
      required: true
    },
    productLine: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableLoading: false,
      submitLoading: false,
      tableData: [],
      currentPage: 1,
      total: 0,
      selectedData: {},
      searchForm: {
        name: ''
      }
    }
  },
  computed: {
    selectText() {
      let arr = []
      if (this.selectedData.gradeName) {
        arr.push(`年级：${this.selectedData.gradeName}`)
      }
      if (this.selectedData.courseTypeName) {
        arr.push(`年级：${this.selectedData.courseTypeName}`)
      }
      if (this.selectedData.regionName) {
        arr.push(`年级：${this.selectedData.regionName}`)
      }
      let str = arr.join('，')
      if (str) str = `（${str}）`
      return this.selectedData.name + str
    }
  },
  watch: {
    visible(n, o) {
      if (n) this.initData()
    }
  },
  methods: {
    async initData() {
      this.selectedData = {}
      this.searchForm.name = ''
      this.getLectureSuite()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async getLectureSuite({
      currentPage = 1,
      pageSize = 5,
      status = 'DISABLED',
      ...params
    } = {}) {
      try {
        let res = await lecture.getLectureSuite({
          currentPage,
          pageSize,
          status,
          gradeId: this.gradeId,
          ...params
        })
        this.tableData = res.data.list
        this.currentPage = res.data.currentPage
        this.total = res.data.total
      } catch (e) {
        this.$message.error(e)
      }
    },
    async changePage(val) {
      this.currentPage = val
      this.getLectureSuite({
        currentPage: this.currentPage,
        ...this.searchForm
      })
    },
    async seachLectureSuite() {
      this.getLectureSuite({ ...this.searchForm })
    },
    selectedItem(item) {
      this.selectedData = this.selectedData.id === item.id ? {} : item
    },
    async handleBind() {
      if (!this.selectedData.id) {
        return this.$message.error('请选择需要绑定的讲义套件')
      }
      this.submitLoading = true
      try {
        let res = await course.bindLectureSuite({
          courseId: this.courseId,
          endTime: this.data.endTime,
          startTime: this.data.startTime,
          startDate: this.data.startDate,
          seq: this.data.seq,
          refId: this.selectedData.id,
          refType: 'LECTURE_SUITE',
          productLine: this.productLine
        })
        this.$emit('success-bind', res.data)
      } catch (err) {
        this.$message.error(err)
      }
      this.submitLoading = false
    }
  }
}
</script>

<style lang="less">
@import url(../../../../assets/less/variables.less);
.lecture-suite-car {
  height: 45px;
  line-height: 45px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #ebeef5;
  margin-bottom: 15px;
  padding: 0 15px;
  color: #999;
  text-align: center;
  &.is-selected {
    color: #3587ff;
    border-color: #3587ff;
    text-align: left;
  }
}
.courese-bind-lecture-suite {
  .el-dialog__header {
    background: #f5f7f9;
    border-bottom: 1px solid @baseBorderColor;
    text-align: center;
    .el-dialog__title {
      font-size: 14px;
    }
  }
  .el-table th {
    background: #f8f8f9;
  }
}
</style>
