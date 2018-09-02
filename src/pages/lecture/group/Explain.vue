<template lang="html">
  <div class="lecture-explain">
    <!-- 创建步骤进度条 -->
    <tr-step :active="defaultActive" :items="steps">
    </tr-step>
    <!-- 讲义试题数据概览 -->
    <tr-lecture-overview
      :lectureId="$route.params.lectureId"
      :lecture-data-source="lectureDataSource"
      @overview-remove-item="overviewRemoveItem"
      @overview-remove-all-item="overviewRemoveAllItem" />
    <!-- 讲义具体的内容 -->
    <div class="content">
      <el-card>
        <!-- 添加引入，框图 -->
        <el-row>
          <el-col :xs="24" :sm="24" :md="20" :lg="16" :xl="16">
            <el-form
              v-show="defaultActive === 1"
              :model="explainForm"
              ref="explainForm"
              label-width="100px"
              class="set-point-form">
              <el-form-item label="知识引入:" prop="content" v-show="!editModalVisible">
                <p class="m-0" v-html="explainForm.content"></p>
              </el-form-item>
              <el-form-item
                v-if="!explainForm.content && !editModalVisible">
                <el-button
                  icon="el-icon-plus" size="small" type="primary" plain
                  @click="handlePointModalVisible(true)">添加知识引入</el-button>
              </el-form-item>
              <el-form-item label="" v-if="explainForm.content && !editModalVisible">
                <!-- 重新选择 focus nodeId -->
                <el-button size="small" type="primary" @click="handlePointModalVisible(true)">重新选择</el-button>
                <el-button size="small" type="primary" @click="handleEditPointModalVisible(true)">编辑</el-button>
                <el-button size="small" @click="deleteContent">删除</el-button>
              </el-form-item>
              <el-form-item label="框图:" prop="chartImgs">
                <img :src="chartImgUrl" @dblclick="scaleImage" alt="" style="width: 100%; margin-top: 15px;">
              </el-form-item>
              <el-form-item label="" prop="chartImgs">
                <el-upload
                  key="upload-chartImgs"
                  id="upload-chartImgs"
                  :before-upload="beforeUpload"
                  :accept="'.'+formatLimit.join(',.')"
                  class="upload-chart-image"
                  :action="uploadUrl"
                  :on-preview="handlePreview"
                  :on-success="handleChartImgSuccess"
                  :on-remove="handleChartImgRemove"
                  :multiple="false"
                  :on-exceed="handleExceed"
                  :file-list="explainForm.chartImgs"
                  :limit="1">
                  <el-button icon="el-icon-upload2" plain size="small" type="primary">点击上传框图</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="button-panel">
          <el-row type="flex" justify="center">
            <el-button size="small" type="primary" @click="goToPrev">上一步</el-button>
            <el-button v-loading.fullscreen.lock="fullscreenLoading" :disabled="editModalVisible" size="small" type="primary" @click="submitForm('explainForm', true)">下一步</el-button>
            <el-button v-loading.fullscreen.lock="fullscreenLoading" :disabled="editModalVisible" size="small" type="primary" @click="submitForm('explainForm', false)">跳过知识编辑步骤</el-button>
            <el-button size="small" @click.prevent="goToPageList">取消</el-button>
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 添加知识点弹出框 -->
    <el-dialog
      :visible.sync="modalVisible"
      title="编辑知识引入"
      class="hi-dialog">
      <div class="tree-content">
        <div class="tree-list">
          <el-input
            size="small"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            class="hi"
            :highlight-current="true"
            :expand-on-click-node="false"
            ref="pointTree"
            :data="treeList"
            :props="defaultProps"
            node-key="nodeId"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode">
          </el-tree>
        </div>
        <div class="tree-list">
          <div class="w-60">
            <p class="m-0">知识引入:</p>
          </div>
          <div class="right-content ml-20">
            <p v-html="preface.content"></p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handlePointModalClose(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="setContent" :disabled="modalVisibleDisabled">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片 -->
    <el-dialog
      :size="imgViewerSize"
      :visible.sync="showImageModal">
      <img :src="imageUrl" @dblclick="scaleImage" alt="" style="width: 100%;">
    </el-dialog>
    <!-- 编辑知识引入 -->
    <el-dialog
      :visible.sync="editModalVisible"
      title="编辑知识引入"
      custom-class="twp-dialog">
      <el-form
        label-width="100px"
        class="set-point-form">
        <el-form-item label="知识引入:" prop="originalContent">
          <el-input
            ref="inputRef"
            placeholder="请输入知识引入..."
            type="textarea"
            :rows="6"
            size="small"
            v-model="dialogExplainForm.originalContent">
          </el-input>
        </el-form-item>
        <el-form-item label="上传图片:" v-if="editModalVisible">
          <el-upload
            :before-upload="beforeUpload"
            :accept="'.'+formatLimit.join(',.')"
            class="original-content"
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            multiple
            :file-list="dialogExplainForm.pictureList"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleEditFormCancel">取 消</el-button>
        <el-button size="small" type="primary" @click.prevent="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '@/utils/fetch.js'
import api from '@/api/lecture'
import TrStep from '../../layout/lecture/Step.vue'
import TrLectureOverview from './Overview.vue'
import { formatValidate, sizeValidate } from '@/utils/_fileValidate'
export default {
  name: 'LectureExplain',
  components: { TrStep, TrLectureOverview },
  data () {
    return {
      steps: [{
        title: '已完成',
        description: '设定知识点'
      }, {
        title: '进行中',
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
      uploadUrl: http.defaults.baseURL + `/lecture/${this.$route.params.id}/upload`,
      defaultActive: 1,
      modalVisible: false,
      // 编辑知识点引入弹出框
      editModalVisible: false,
      showImageModal: false,
      imgViewerSize: '',
      imageUrl: '',
      chartImgUrl: '',
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      selectedPoints: [],
      filterText: '',
      // 添加引入，框图 相关的参数
      explainForm: {
        content: null,
        pictureList: [],
        chartImgs: []
      },
      dialogExplainForm: {
        content: null,
        pictureList: [],
        chartImgs: []
      },
      preface: {
        content: ''
      },
      // 概览试题 变量
      lectureDataSource: {
        pointItemOverviewVoList: [],
        duration: 0,
        itemTotal: 0
      },
      formatLimit: ['jpg', 'png', 'jpeg'],
      fileLengthLimit: 5,
      sizeLimit: 2 // M
    }
  },
  updated () {
    if (window.MathJax && window.MathJax.Hub) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  },
  computed: {
    lectureId () {
      return this.$route.params.lectureId
    },
    modalVisibleDisabled () {
      return false
    }
  },
  mounted () {
    this.fetch()
    this.getPointTree()
    this.getOverview()
  },
  watch: {
    filterText (val) {
      this.$refs.pointTree.filter(val)
    }
  },
  methods: {
    async getPointTree () {
      let res = await api.getLecturePointTree({lectureId: this.lectureId})
      this.treeList = res.data.list
    },
    // 提交 第2步 表单
    submitForm (formName, flag) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateExplain()
          if (flag) {
            this.goNext()
          } else {
            this.goToItems()
          }
        } else {
          return false
        }
      })
    },
    async updateExplain () {
      let chartImgIds = this.explainForm.chartImgs.map(item => {
        return item.id
      })
      let pictureList = this.explainForm.pictureList.map(item => {
        return item.id
      })
      let params = {
        chartImgIds: chartImgIds,
        pictureList: pictureList,
        lectureId: this.lectureId,
        originalContent: this.explainForm.originalContent
      }
      try {
        this.fullscreenLoading = true
        let res = await api.updateExplain(params)
        if (res.success) {
          this.$message({ type: 'success', message: res.message || '' })
        }
      } catch (e) {
        this.$message({ type: 'error', message: e.message })
      } finally {
        this.fullscreenLoading = false
      }
    },
    // 添加知识点引入 弹框
    handlePointModalVisible (flag) {
      this.modalVisible = !!flag
    },
    // 删除 设定知识点
    handlePointModalClose (flag) {
      this.filterText = ''
      // TODO: 关闭前 先清除 数据 同时要保证编辑状态下已有的哪些不被清除
      this.modalVisible = flag
    },
    // 弹出知识点引入编辑框
    handleEditPointModalVisible (flag) {
      this.dialogExplainForm = Object.assign({}, this.explainForm)
      this.editModalVisible = !!flag
    },
    handleEditPointModalClose (flag) {
      this.editModalVisible = flag
    },
    // 知识树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.nodeName.indexOf(value.trim()) !== -1
    },
    async fetch () {
      let params = {lectureId: this.lectureId}
      let res = await api.fetch(params)
      let explain = res.data && res.data.explain
      if (explain.chartImgs && explain.chartImgs.length) {
        this.chartImgUrl = explain.chartImgs[0] && explain.chartImgs[0].url
      }
      this.explainForm = Object.assign({}, explain)
    },
    // 删除知识引入内容
    deleteContent () {
      this.$set(this.explainForm, 'originalContent', '')
      this.$set(this.explainForm, 'content', '')
      this.$set(this.explainForm, 'pictureList', [])
    },
    setContent () {
      this.explainForm = Object.assign({}, this.explainForm, this.preface)
      this.handlePointModalClose(false)
    },
    handleNodeClick (node) {
      this.getExplain(node.nodeId)
    },
    async getExplain (pointId) {
      try {
        let res = await api.getExplainByPointId({pointId: pointId, type: 'PREFACE'})
        if (!res.success) {
          this.$message({ type: 'error', message: res.message || '' })
        }
        this.preface = Object.assign({}, this.preface, res.data)
        // return res.data
      } catch (e) {
        this.$message({ type: 'error', message: e.message || '' })
      }
    },
    // 上传图片
    handleRemove(file, fileList) {
      if (file.status !== 'success') {
        return
      }
      if (file.id) {
        this.dialogExplainForm.originalContent = this.dialogExplainForm.originalContent.replace(`@{${file.id}}`, '')
        let idx = this.dialogExplainForm.pictureList.indexOf(file)
        this.dialogExplainForm.pictureList.splice(idx, 1)
        return
      }
      if (!(file.response && file.response.success)) {
        this.$message.error(file.response.message || '上传图片失败')
        return
      }
      let item = file.response.data && file.response.data.list && file.response.data.list[0]
      this.dialogExplainForm.originalContent = this.dialogExplainForm.originalContent.replace(`@{${item.id}}`, '')
      let idx = this.dialogExplainForm.pictureList.indexOf(file)
      this.dialogExplainForm.pictureList.splice(idx, 1)
    },
    handleSuccess (response, file) {
      if (response.success && response.data.list.length) {
        let start = 0
        let end = 0
        let element = this.$refs.inputRef.$el.querySelector('textarea')
        start = element.selectionStart
        end = element.selectionEnd
        let item = response.data.list[0]
        if (!this.dialogExplainForm.originalContent) {
          this.dialogExplainForm.originalContent = ''
        }
        file.url = item.url || ''
        file.id = item.id
        file.refId = item.refId
        this.dialogExplainForm.originalContent = this.dialogExplainForm.originalContent.slice(0, start) + '@{' + item.id + '}' + this.dialogExplainForm.originalContent.slice(end)
        this.dialogExplainForm.pictureList.push(file)
      } else {
        this.$message.error('上传图片失败')
      }
    },
    handlePreview(file) {
      this.imgViewerSize = ''
      this.showImageModal = true
      this.imageUrl = file.url
    },
    handleExceed(files, fileList) {
      this.$message.warning(`框图只能选择一张...`)
    },
    handleChartImgSuccess (res, file) {
      if (res.success && res.data.list.length) {
        let item = res.data.list[0]
        file.url = item.url || ''
        file.id = item.id
        file.refId = item.refId
        this.explainForm.chartImgs = [file]
        this.chartImgUrl = file.url
      } else {
        this.$message.error('上传图片失败')
      }
    },
    handleChartImgRemove (file) {
      this.chartImgUrl = ''
      this.$set(this.explainForm, 'chartImgs', [])
    },
    // 放大图片
    scaleImage () {
      if (this.imgViewerSize) {
        this.imgViewerSize = ''
      } else {
        this.imgViewerSize = 'large'
      }
    },
    handleEditFormCancel () {
      this.dialogExplainForm = {}
      this.handleEditPointModalClose(false)
    },
    submitEditForm () {
      this.explainForm = Object.assign({}, this.explainForm, this.dialogExplainForm)
      this.dialogExplainForm = {}
      this.explainForm.content = this.replaceImages2Content(this.explainForm.pictureList, this.explainForm.originalContent)
      this.editModalVisible = false
    },
    replaceImages2Content (pictureList, originalContent) {
      let content = originalContent
      if (pictureList instanceof Array && pictureList.length) {
        pictureList.forEach(pic => {
          let imageDom = '<br/><img src="' + pic.url + '"/>'
          content = content.replace(`@{${pic.id}}`, imageDom)
        })
      }
      return content
    },
    goToPrev () {
      // 这里应该跳到编辑的设定知识点
      this.$router.push({
        name: 'lecture_set_point_edit',
        params: {
          lectureId: this.lectureId
        },
        query: this.$route.query
      })
    },
    goNext () {
      this.$router.push({
        name: 'lecture_description',
        params: {
          lectureId: this.lectureId
        },
        query: this.$route.query
      })
    },
    // 直接跳转到添加例题练习题页面
    goToItems () {
      this.$router.push({
        name: 'lecture_exercises_items',
        params: {
          lectureId: this.lectureId
        },
        query: Object.assign({}, this.$route.query, { from: 'Explain' })
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
    },
    beforeUpload (file) {
      let formatCheck = formatValidate(file, this.formatLimit)
      let sizeCheck = sizeValidate(file, this.sizeLimit, 'M')
      if (!formatCheck) {
        this.$message.error(`图片只支持${this.formatLimit.join('/')}格式`)
        return false
      }
      if (!sizeCheck) {
        this.$message.error(`图片大小不能超过${this.sizeLimit}M`)
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less">
  .lecture-explain {
    .mb-20 {
      margin-bottom: 20px;
    }
    .ml-20 {
      margin-left: 20px;
    }
    .m-0 {
      margin: 0;
    }
    .w-60 {
      min-width: 60px;
      width: 60px;
      max-width: 60px;
    }
    img {
      max-width: 300px;
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
