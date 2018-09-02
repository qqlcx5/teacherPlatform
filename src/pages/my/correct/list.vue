<template>
  <div class="p-correct-list" v-mathjax>
    <div class="correct-selector">
      <dl v-for="item in selectorData" :key="item.key">
        <dt>{{item.label}}：</dt>
        <dd v-if="item.list && item.list.length > 0">
          <span :class="{'is-select': '' === selectedResult[item.key]}" @click="select(item.key)">不限</span>
          <span v-for="sub in item.list" :class="{'is-select': sub.code === selectedResult[item.key]}" :key="sub.code" @click="select(item.key, sub.code)">{{sub.label}}</span>
        </dd>
      </dl>
    </div>
    <el-table :data="tableData" style="width: 100%" border class="hi" v-loading="tableLoading">
      <el-table-column label="题干" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-html="scope.row.itemStem" class="p-correct-list__stem"></div>
        </template>
      </el-table-column>
      <el-table-column prop="periodName" label="学段" width="80">
      </el-table-column>
      <el-table-column prop="subjectName" label="科目" width="80">
      </el-table-column>
      <el-table-column prop="errorTypeName" label="纠错类型" width="200">
      </el-table-column>
      <el-table-column prop="createTime" label="提交纠错时间" width="160">
      </el-table-column>
      <el-table-column prop="approveStatusName" label="审核状态" width="100">
      </el-table-column>
      <el-table-column prop="correctStatus" align="center" label="纠错状态" width="100">
        <template slot-scope="scope">
          <span>{{correctStatusTxt(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-tooltip effect="blue" content="查看" placement="top">
            <button class="m-table-btn__operate" @click="view(scope.row.id)">
              <i class="iconfont icon-See"></i>
            </button>
          </el-tooltip>
          <el-tooltip effect="blue" content="撤回" placement="top">
            <button class="m-table-btn__operate" @click="undo(scope)" :disabled="scope.row.approveStatus !== 'APPROVAL_PENDING'">
              <i class="iconfont icon-withdraw"></i>
            </button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="text-right mt-20" v-if="pageTotal > 0">
      <el-pagination class="hi" background :current-page="currentPage" @current-change="changePage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { correct } from '../../../api'
import { mapState } from 'vuex'

const approveStatusList = {
  key: 'approveStatus',
  label: '审批状态',
  list: [
    { label: '待审批', code: 'APPROVAL_PENDING' },
    { label: '审批通过', code: 'PASS' },
    { label: '审批未通过', code: 'NO_PASS' },
    { label: '已撤回', code: 'CANCELED' },
    { label: '审批通过/待纠错', code: 'CORRECT_PENDING' },
    { label: '审批通过/已纠错', code: 'CORRECTED' }
  ]
}
const correctStatusList = {
  key: 'correctStatus',
  label: '纠错状态',
  list: [
    { label: '审批通过/待纠错', code: 'CORRECT_PENDING' },
    { label: '审批通过/已纠错', code: 'CORRECTED' }
  ]
}
export default {
  data() {
    return {
      tableData: [],
      tableLoading: false,
      pageTotal: 0,
      currentPage: 1,
      pageSize: 10,
      selectedResult: {
        subjectId: '',
        periodId: '',
        approveStatus: '',
        correctStatus: ''
      },
      approveStatusList,
      correctStatusList
    }
  },
  computed: {
    ...mapState({
      sgrOptions: state => state.app.sgrOptions
    }),
    selectorData() {
      let arr = this.sgrOptions.filter(
        v => ['subjectId', 'periodId'].indexOf(v.key) > -1
      )
      return [...arr, this.approveStatusList]
    },
    filtersData() {
      const res = this.correctStatusList.list.map(v => {
        return {
          text: v.label,
          value: v.code
        }
      })
      return res
    },
    showDropCorrectFilter() {
      return (
        this.selectedResult.approveStatus === 'PASS' ||
        this.selectedResult.approveStatus === ''
      )
    }
  },
  created() {
    this.getCorrectList()
  },
  methods: {
    // 获取纠错列表
    async getCorrectList(params = {}) {
      const result = {...this.selectedResult}
      if (this.selectedResult.approveStatus === 'CORRECT_PENDING' || this.selectedResult.approveStatus === 'CORRECTED') {
        result.approveStatus = ''
        result.correctStatus = this.selectedResult.approveStatus
      }
      try {
        const res = await correct.getCorrectList({
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          ...result
        })
        if (res.data) {
          this.pageTotal = res.data.total
          this.currentPage = res.data.currentPage
          this.tableData = res.data.list
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    // 分页查询
    changePage(val) {
      this.currentPage = val
      this.getCorrectList()
    },
    // 筛选器筛选
    select(key, code = '') {
      this.selectedResult[key] = code
      this.currentPage = 1
      // const bol =
      //   key === 'approveStatus' &&
      //   (code === 'APPROVAL_PENDING' || code === 'NO_PASS')
      // this.selectKey = bol ? 'correctStatus' : ''
      this.getCorrectList()
    },
    // 撤回
    async undo(scope) {
      try {
        await this.$confirm(`确定撤回该报错题目？`, { type: 'warning' })
        const record = this.tableData.find(v => v.id === scope.row.id)
        if (record) record.approveStatusName = '已撤回'
        scope.row.approveStatus = 'CANCELED'
        await correct.unDoCorrect(scope.row.id)
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    },
    // 查看
    view(id) {
      this.$router.push({ name: 'correctDetail', params: { id } })
    },
    // 表格筛选
    filterHandler(value, row) {
      console.log(value)
      console.log(row)
      return row.correctStatus === value
    },
    correctStatusTxt(row) {
      const bol =
        row.approveStatus === 'APPROVAL_PENDING' ||
        row.approveStatus === 'NO_PASS' ||
        row.approveStatus === 'CANCELED'
      const str = bol ? '——' : row.correctStatusName
      return str
    }
  }
}
</script>

<style lang="less">
.p-correct-list {
  .correct-selector {
    background: #fff;
    border: 1px solid #eee;
    margin-bottom: 20px;
    padding: 15px 25px;
    border-radius: 4px;
    & > dl {
      display: flex;
      align-items: baseline;
      margin: 0;
      padding: 0;
      & > dd {
        flex: 1;
        margin-left: 10px;
        overflow: hidden;
        & > span {
          margin-right: 10px;
          cursor: pointer;
          padding: 3px 10px;
          border-radius: 4px;
          display: inline-block;
          &.is-select {
            color: #fff;
            background-color: rgb(64, 158, 255);
          }
        }
      }
    }
    & > dl + dl {
      padding-top: 10px;
    }
  }
}
.el-table th > .cell.highlight {
  color: rgb(64, 158, 255);
}
.p-correct-list__stem {
  white-space: normal;
  img {
    width: 150px;
  }
}
</style>
