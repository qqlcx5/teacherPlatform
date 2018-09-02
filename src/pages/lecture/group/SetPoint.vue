<template lang="html">
  <div class="lecture-set-point">
    <!-- 创建步骤进度条 -->
    <tr-step :active="defaultActive" :items="steps">
    </tr-step>
    <!-- 讲义试题数据概览 -->
    <tr-lecture-overview
      v-show="isEdit"
      :lectureId="$route.params.lectureId"
      :lecture-data-source="lectureDataSource"
      @overview-remove-item="overviewRemoveItem"
      @overview-remove-all-item="overviewRemoveAllItem" />
    <!-- 讲义具体的内容 -->
    <div class="content">
      <el-card>
        <!-- 设定知识点 -->
        <el-form
          :model="setPointForm"
          :rules="setPointRules"
          ref="setPointForm"
          label-width="100px"
          class="set-point-form">
          <el-form-item label="讲义名称" prop="name">
            <el-input style="width: 300px;" size="small" v-model="setPointForm.name"></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="gradeId">
            <el-select size="small" v-model="setPointForm.gradeId" placeholder="请选择" :disabled="isEdit">
              <el-option
                v-for="item in gradeList"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品线" prop="productCode">
            <el-radio-group size="small" v-model="setPointForm.productCode">
              <el-radio
                v-for="item in productLineList"
                :key="item.code"
                :label="item.code">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程类型" prop="courseTypeId">
            <el-radio-group size="small" v-model="setPointForm.courseTypeId">
              <el-radio
                v-for="item in courseTypeList"
                :key="item.code"
                :label="item.code">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设定知识点" prop="lecturePointRequire">
            <el-button
              plain
              size="small"
              icon="el-icon-plus"
              class="mb-20"
              type="primary"
              :disabled="!setPointForm.gradeId"
              @click="handlePointModalVisible(true)">
              添加知识点
            </el-button>
            <el-table
              border
              :data="setPointForm.lecturePointRequire"
              :row-key="rowKey"
              style="width: 100%">
              <el-table-column
                prop="pointName"
                label="知识点"
                width="180">
              </el-table-column>
              <el-table-column
                prop="requireName"
                label="考试要求"
                width="180">
              </el-table-column>
              <el-table-column
                prop="requireDetail"
                label="具体要求">
              </el-table-column>
              <el-table-column
                prop="frequencyName"
                label="考查频率">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="handleDeletePoint(scope.$index, scope.row, setPointForm.lecturePointRequire)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <div class="button-panel">
            <el-row type="flex" justify="center">
              <el-button v-loading.fullscreen.lock="fullscreenLoading" size="small" type="primary" @click="submitForm('setPointForm', true)">下一步</el-button>
              <el-button v-loading.fullscreen.lock="fullscreenLoading" size="small" type="primary" @click="submitForm('setPointForm', false)">跳过框图，知识编辑步骤</el-button>
              <el-button size="small" @click.prevent="goToPageList">取消</el-button>
            </el-row>
          </div>
        </el-form>
      </el-card>
    </div>
    <!-- 添加知识点弹出框 -->
    <el-dialog
      class="hi-dialog"
      :visible.sync="modalVisible"
      title="选择知识点">
      <div class="tree-content">
        <div class="tree-list">
          <el-input
            size="small"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            ref="pointTree"
            :data="treeList"
            :props="defaultProps"
            show-checkbox
            node-key="nodeId"
            :check-strictly="true"
            @check-change="handleNodeCheck"
            :filter-node-method="filterNode"
            :default-checked-keys="defaultCheckedKeys">
          </el-tree>
        </div>
        <div class="tree-list">
          <el-tag
            class="point-item-tag"
            v-for="item in selectedPoints"
            :key="item.nodeId"
            size="small"
            closable
            @close="handlePointClose(item)">
            {{item.nodeName}}
          </el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handlePointModalClose(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="setPoints" :disabled="modalVisibleDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/lecture'
import TrStep from '../../layout/lecture/Step.vue'
import TrLectureOverview from './Overview.vue'
export default {
  name: 'LectureSetPoint',
  components: { TrStep, TrLectureOverview },
  data () {
    return {
      steps: [{
        title: '进行中',
        description: '设定知识点'
      }, {
        title: '未开始',
        description: '添加引入,框图'
      }, {
        title: '未开始',
        description: '编辑描述,总结'
      }, {
        title: '未开始',
        description: '添加例题,练习题'
      }, {
        title: '未开始',
        description: '完成'
      }],
      fullscreenLoading: false,
      defaultActive: 0,
      lectureId: this.$route.params.lectureId || null,
      setPointForm: {
        name: null,
        gradeId: null,
        productCode: null,
        courseTypeId: null,
        lecturePointRequire: []
      },
      setPointRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        gradeId: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        productCode: [
          { required: true, message: '请选择产品线', trigger: 'change' }
        ],
        courseTypeId: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        lecturePointRequire: [
          { type: 'array', required: true, message: '至少设定一个知识点', trigger: 'change' }
        ]
      },
      gradeList: [],
      courseTypeList: [],
      productLineList: [],
      modalVisible: false,
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      selectedPoints: [],
      defaultCheckedKeys: [],
      filterText: '',
      // 概览试题 变量
      lectureDataSource: {
        pointItemOverviewVoList: [],
        duration: 0,
        itemTotal: 0
      },
      cancel: true
    }
  },
  updated () {
    if (window.MathJax && window.MathJax.Hub) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  },
  mounted () {
    this.fetch()
    this.$store.commit('SET_SGRVISIBLE', false)
  },
  computed: {
    modalVisibleDisabled () {
      return !this.selectedPoints.length
    },
    isEdit () {
      return !!this.lectureId
    }
  },
  watch: {
    filterText (val) {
      this.$refs.pointTree.filter(val)
    },
    'setPointForm.gradeId': function(val, oldVal) {
      if (!val) {
        return
      }
      // 改变 gradeId 清空设定知识点
      if (!this.isEdit && this.setPointForm.lecturePointRequire.length) {
        if (this.cancel) {
          this.$confirm('此操作将删除已设定知识点, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.cancel = true
            this.initPointData()
            this.getPointTree()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.cancel = false
            this.$set(this.setPointForm, 'gradeId', oldVal)
          })
        }
      } else {
        this.getPointTree()
      }
      this.cancel = true
    }
  },
  methods: {
    initPointData () {
      console.log('initPointData')
      this.$set(this, 'selectedPoints', [])
      this.$set(this, 'defaultCheckedKeys', [])
      this.$set(this.setPointForm, 'lecturePointRequire', [])
    },
    rowKey (row) {
      return row.pointId
    },
    async getDictionary () {
      let params = {
        type: 'LECTURE',
        needUnchecked: false
      }
      let res = await api.getDictionary(params)
      if (res.data && res.data.length > 1) {
        this.gradeList = res.data[0].list || []
        this.productLineList = res.data[1].list || []
        this.courseTypeList = res.data[2].list || []
      }
    },
    async getPointTree () {
      try {
        let res = null
        if (this.isEdit) {
          res = await api.getLecturePointTree({lectureId: this.lectureId})
        } else {
          const { gradeId } = this.setPointForm
          res = await api.getPointTree({ gradeId })
        }
        this.treeList = res.data.list
      } catch (e) {
        this.$message({ type: 'error', message: e.message || '' })
      }
    },
    // 提交 第一步 表单
    submitForm (formName, flag) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            this.create(flag)
          } catch (e) {
            this.$message({ type: 'error', message: e.message || '' })
          }
        } else {
          return false
        }
      })
    },
    handlePointModalVisible (flag) {
      let pointIds = []
      if (this.setPointForm.lecturePointRequire.length) {
        pointIds = this.setPointForm.lecturePointRequire.map(point => { return point.pointId }) || []
      }
      this.$set(this, 'defaultCheckedKeys', pointIds)
      this.modalVisible = !!flag
    },
    handleNodeCheck (node) {
      this.getCheckedNodes()
    },
    getCheckedNodes() {
      this.selectedPoints = this.$refs.pointTree.getCheckedNodes()
      return this.selectedPoints
    },
    getCheckedKeys() {
      return this.$refs.pointTree.getCheckedKeys()
    },
    handlePointClose (item) {
      this.$refs.pointTree.setChecked(item.nodeId, false, false)
      this.selectedPoints = this.$refs.pointTree.getCheckedNodes()
    },
    // 知识树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.nodeName.indexOf(value.trim()) !== -1
    },
    // 获取设定知识点列表描述
    async setPoints () {
      // array
      let checkedKeys = this.getCheckedKeys()
      let points = await this.getPointRequire({pointIds: checkedKeys})
      this.$set(this.setPointForm, 'lecturePointRequire', points)
      this.$set(this.setPointForm, 'pointIds', checkedKeys)
      this.handlePointModalClose(false)
    },
    async getPointRequire ({pointIds, regionId}) {
      let res = await api.getPointRequire({pointIds, regionId})
      if (res.success) {
        return res.data.list
      } else {
        this.$message({ type: 'error', message: res.message || '' })
        return []
      }
    },
    // 删除 设定知识点
    handleDeletePoint (index, item, items) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        items.splice(index, 1)
        console.log('key deleted: ' + this.setPointForm.lecturePointRequire)
        if (this.$refs.pointTree) {
          // 第一次进来编辑，则 this.$refs.pointTree 还未初始化
          this.$refs.pointTree.setChecked(item.pointId, false, false)
          this.selectedPoints = this.$refs.pointTree.getCheckedNodes()
        }
        let idx = this.defaultCheckedKeys.indexOf(item.pointId)
        this.defaultCheckedKeys.splice(idx, 1)
        // this.$set(this.setPointForm, 'pointIds', this.defaultCheckedKeys)
        // this.selectedPoints = _.cloneDeep(items)
      }).catch((e) => {
        this.$message({ type: 'info', message: e.message || '已取消删除' })
      })
    },
    handlePointModalClose (flag) {
      this.filterText = ''
      // TODO: 关闭前 先清除 数据 同时要保证编辑状态下已有的哪些不被清除
      this.modalVisible = flag
    },
    // 创建讲义
    async create (flag) {
      try {
        this.fullscreenLoading = true
        let pointIds = this.setPointForm.lecturePointRequire.map(require => {
          return require.pointId
        })
        pointIds = [...new Set(pointIds)]
        if (this.isEdit) {
          this.setPointForm = Object.assign({}, this.setPointForm, {lectureId: this.lectureId, pointIds: pointIds})
        } else {
          this.setPointForm = Object.assign({}, this.setPointForm, {pointIds: pointIds})
        }
        let res = await api.create(this.setPointForm)
        if (res.success) {
          this.$set(this, 'lectureId', res.data)
          this.$message.success({ message: res.message || '' })
          flag ? this.goToNext() : this.goToItems()
        } else {
          this.$message.error({ message: res.message || '' })
          return false
        }
      } catch (e) {
        this.$message({ type: 'error', message: e.message })
      } finally {
        this.fullscreenLoading = false
      }
    },
    // 如果是编辑状态则获取该讲义
    async fetch () {
      if (this.isEdit) {
        let params = { lectureId: this.lectureId }
        let res = await api.fetch(params)
        const {
          lectureName: name,
          gradeId,
          courseTypeId,
          lecturePointRequire,
          subject: {code: subjectId},
          period: {code: periodId},
          region: {code: regionId},
          productCode
        } = res.data
        const pointIds = lecturePointRequire.map(point => { return point.pointId }) || []
        this.setPointForm = Object.assign({}, {name, gradeId, courseTypeId, lecturePointRequire, subjectId, regionId, periodId, pointIds, productCode})
        console.log(this.setPointForm)
        this.defaultCheckedKeys = pointIds
        this.selectedPoints = lecturePointRequire
        // 编辑状态下 获取 概览数据
        this.getOverview()
      }
      await this.getDictionary()
    },
    goToNext () {
      this.$router.push({
        name: 'lecture_explain',
        params: {
          lectureId: this.$route.params.lectureId
        },
        query: this.$route.query
      })
    },
    goToItems () {
      this.$router.push({
        name: 'lecture_exercises_items',
        params: {
          lectureId: this.lectureId
        },
        query: Object.assign({}, this.$route.query, { from: 'setPoint' })
      })
    },
    // 返回讲义列表
    goToPageList () {
      let name = this.$route.query.hasOwnProperty('source') ? 'draft' : 'lecture_index'
      this.$router.push({
        name
      })
    },
    // 概览列表删除题目
    async overviewRemoveItem (item) {
      const { pointId } = item
      const { lectureId } = this
      if (!pointId) {
        return this.$message.warning('该题目无id')
      }
      let res = await api.clearItem({lectureId, pointId})
      if (res.success) {
        this.lectureDataSource.pointItemOverviewVoList.splice(this.lectureDataSource.pointItemOverviewVoList.indexOf(item), 1)
        this.getOverview()
      } else {
        this.$message.error('删除题目失败...')
      }
    },
    async overviewRemoveAllItem () {
      if (this.lectureDataSource.itemTotal === 0) {
        return this.$message.info('无可删除的题目')
      }
      const { lectureId } = this
      let res = await api.clearAllItems({ lectureId })
      if (res.success) {
        this.$message.success('清空成功...')
        this.getOverview()
      } else {
        this.$message.error('清空所有题目失败...')
      }
    },
    async getOverview () {
      let res = await api.overview({lectureId: this.$route.params.lectureId})
      if (res.success) {
        this.lectureDataSource = Object.assign({}, res.data || {})
      } else {
        this.$message.error('无法删除')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .lecture-set-point {
    .mb-20 {
      margin-bottom: 20px;
    }
  }
  .tree-content {
    display: flex;
    .tree-list {
      border: 1px solid #e9eaec;
      flex: 1;
      overflow-y: auto;
      height: 540px;
      min-height: 540px;
      max-height: 540px;
      display: flex;
      flex-direction: column;
      padding: 10px;

      .point-item-tag {
        margin-bottom: 10px;
      }
    }
  }
</style>
