<template>
  <div class="knowledge-import">
    <div class="tab">
      <span @click.prevent="gotoMyLecture"><i class="sidebar__sub-icon"></i>我的讲义</span>
      <span><i class="sidebar__sub-icon active"></i>我的知识引入</span>
      <span @click.prevent="gotoKnowledgeSummary"><i class="sidebar__sub-icon"></i>我的知识总结</span>
      <span @click.prevent="gotoKnowledgeSuite">
        <i class="sidebar__sub-icon"></i>讲义套件</span>
      <span @click.prevent="gotoMyPaper">
        <i class="sidebar__sub-icon"></i>我的试卷</span>
    </div>
    <div class="knowledge-import-content">
      <div class="point-tree-container">
        <knowledge-tree :data="treeData" @change="handleNodeClick"/>
        <!-- <el-tree
          class="hi"
          @node-click="handleNodeClick"
          :data="treeData"
          :props="{label: 'title'}"
          :highlight-current="true"
          :expand-on-click-node="false">
        </el-tree> -->
      </div>
      <div class="point-explain-container">
        <div class="point-label">{{selectedPointData.title}}</div>
        <!-- 初始无知识点引入 -->
        <div class="point-explain--initial" v-if="initial&&!forView&&!forEdit" key="initial">
          <p>该知识点下没有内容，请先添加！</p>
          <el-button type="primary" size="small" @click="addPointExplain">添加</el-button>
        </div>
        <!-- 查看知识引入 -->
        <div class="point-explain--view" v-if="!initial&&forView&&!forEdit" key="forView">
          <el-form label-width="100px">
            <div class="layout-row baseline">
              <div class="title">
                知识引入:
              </div>
              <div class="layout-column">
                <div class="content" v-html="pointExplain.content"></div>
              </div>
            </div>
            <!-- <el-form-item label="知识引入：">
              <div v-html="pointExplain.content"></div>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" size="small" @click="editPointExplain">修改</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 添加/编辑知识引入 -->
        <div class="point-explain--edit" v-if="!initial&&!forView&&forEdit" key="forEdit">
          <el-form label-width="100px">
            <el-form-item label="知识引入：">
              <el-input ref="inputRef" type="textarea" :rows="4" v-model="originalContentCopy" placeholder="请输入知识引入"></el-input>
            </el-form-item>
            <el-form-item label="上传图片：">
              <el-upload
                :accept="'.'+formatLimit.join(',.')"
                ref="imgUploadRef"
                :action="uploadUrl"
                :data="uploadData"
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :on-remove="handleUploadRemove"
                :on-preview="handleUploadPreview"
                :file-list="pointExplain.pictureList"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="confirmEdit">确定</el-button>
              <el-button size="small" @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="previewDialogVisible" width="600px">
      <img class="preview-img" :src="previewUrl">
    </el-dialog>
  </div>
</template>
<script>
import { baseUrl } from '@/config/env'
import lectureApi from '@/api/lecture'
import {formatValidate, sizeValidate} from '@/utils/_fileValidate'
import knowledgeTree from '@/components/knowledgeTree/Index'
export default {
  name: 'KnowledgeImport',
  data () {
    return {
      treeData: [],
      selectedPointData: {},
      pointExplain: {
        originalContent: '',
        pictureList: []
      },
      pointExplainId: '',
      originalContentCopy: '',
      forView: false,
      forEdit: false,
      initial: false,
      fileLengthLimit: 5,
      sizeLimit: 2, // M
      formatLimit: ['jpg', 'png', 'jpeg'],
      previewDialogVisible: false,
      previewUrl: ''
    }
  },
  computed: {
    uploadUrl () {
      return `${baseUrl}/point/explain/upload`
    },
    uploadData () {
      return {
        pointExplainId: this.pointExplainId || '',
        type: 'EXPLAIN_TEXT'
      }
    },
    userSgr() {
      return this.$store.state.user.userSgr
    }
  },
  watch: {
    userSgr(val) {
      this.getPointTree()
      this.selectedPointData = {}
    },
    selectedPointData (val) {
      this.initial = Boolean(Object.keys(val).length) || this.treeData.length > 0
    }
  },
  updated () {
    if (window.MathJax && window.MathJax.Hub) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  },
  mounted () {
    this.getPointTree()
  },
  components: {
    knowledgeTree
  },
  methods: {
    getPointTree () {
      lectureApi.getTree().then(res => {
        this.treeData = res.data.list || []
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getPointExplain () {
      lectureApi.getPointExplain({id: this.selectedPointData.nodeId, type: 'PREFACE'}).then(res => {
        if (res.data && res.data.originalContent) {
          this.initial = false
          this.forEdit = false
          this.forView = true
          this.pointExplainId = res.data.id
          this.pointExplain = res.data
          this.originalContentCopy = this.pointExplain.originalContent
        } else {
          this.initial = true
          this.forEdit = false
          this.forView = false
          this.pointExplainId = ''
          this.pointExplain = {
            originalContent: '',
            pictureList: []
          }
          this.originalContentCopy = ''
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleNodeClick (pointData) {
      this.selectedPointData = pointData
      this.getPointExplain()
    },
    addPointExplain () {
      let params = {
        pointId: this.selectedPointData.nodeId,
        type: 'PREFACE'
      }
      lectureApi.createPrefaceExplain(params).then(res => {
        if (res.success && res.data) {
          this.initial = false
          this.forEdit = true
          this.forView = false
          this.pointExplainId = res.data || ''
        } else {
          this.$message.error('无法添加....')
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    editPointExplain () {
      this.forView = false
      this.initial = false
      this.forEdit = true
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
    },
    handleUploadSuccess (response, file, fileList) {
      let start = 0
      let end = 0
      let element = this.$refs.inputRef.$el.querySelector('textarea')
      start = element.selectionStart
      end = element.selectionEnd
      let item = response.data && response.data.list && response.data.list[0]
      if (!this.originalContentCopy) {
        this.originalContentCopy = ''
      }
      this.originalContentCopy = this.originalContentCopy.slice(0, start) + '@{' + item.id + '}' + this.originalContentCopy.slice(end)
    },
    handleUploadRemove (file, fileList) {
      console.log(file)
      if (file.status !== 'success') {
        return
      }
      if (file.id) {
        this.originalContentCopy = this.originalContentCopy.replace(`@{${file.id}}`, '')
        return
      }
      if (!(file.response && file.response.success)) {
        this.$message.error(file.response.message || '上传图片失败')
        return
      }
      let item = file.response.data && file.response.data.list && file.response.data.list[0]
      this.originalContentCopy = this.originalContentCopy.replace(`@{${item.id}}`, '')
    },
    handleUploadPreview (file) {
      this.previewDialogVisible = true
      this.previewUrl = file.url
    },
    confirmEdit () {
      if (!this.originalContentCopy.trim()) {
        return this.$message.error('请填写知识引入!')
      }
      this.pointExplain.originalContent = this.originalContentCopy
      let params = {
        id: this.pointExplainId,
        content: this.pointExplain.originalContent
      }
      lectureApi.updatePrefaceExplain(params).then(res => {
        if (res.success) {
          this.initial = false
          this.forEdit = false
          this.forView = true
          this.pointExplain.content = res.data.content
          this.pointExplain.pictureList = res.data.pictureList
        } else {
          this.initial = false
          this.forEdit = true
          this.forView = false
          this.$message.error('编辑失败')
        }
      }, (error) => {
        this.$message.error(error || '失败')
      })
    },
    cancelEdit () {
      if (!this.pointExplain.originalContent) {
        this.initial = true
        this.forEdit = false
        this.forView = false
        this.originalContentCopy = ''
      } else {
        this.initial = false
        this.forEdit = false
        this.forView = true
        this.originalContentCopy = this.pointExplain.originalContent
      }
    },
    // tab 跳转
    gotoMyLecture () {
      this.$router.push({
        name: 'lecture_index',
        query: this.$route.query
      })
    },
    gotoKnowledgeSuite() {
      this.$router.push({
        name: 'lecture_suite',
        query: this.$route.query
      })
    },
    gotoKnowledgeSummary () {
      this.$router.push({
        name: 'lecture_knowledge_sumary',
        query: this.$route.query
      })
    },
    gotoMyPaper() {
      this.$router.push({
        name: 'my_paper'
      })
    }
  }
}
</script>
<style lang="less">
.knowledge-import{
  display: flex;
  flex-direction: column;

  .knowledge-import-content {
    min-height:calc(~"(100vh - 150px)");
    display: flex;
  }

  .tab {
    margin-bottom: 20px;
    display: block;
    span {
      border-radius: 4px;
      padding: 6px 12px;
      background: #fff;
      margin-right: 10px;
      cursor: pointer;
      .sidebar__sub-icon {
        background: #ddd;
        position: relative;
        top: -1px;
      }
      i.active {
        background: #409eff;
      }
    }
  }

  .point-tree-container{
    width:240px;
    margin-right:20px;
    background-color: #fff;
    padding:20px;
  }
  .point-explain-container{
    flex: 1;
    padding-right:20px;
    background-color: #fff;
    // width:210mm;
    word-break: break-word;
    .point-label{
      text-align: center;
      padding:10px 0;
      font-weight:bold;
    }
    .point-explain--initial{
      text-align: center;
      margin-top: 60px;
    }
    .point-explain--view {
      img {
        max-width: 100%;
      }
      .title {
        min-width: 100px;
        max-width: 100px;
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: rgb(96, 98, 102);
        line-height: 40px;
        box-sizing: border-box;
        padding: 0px 12px 0px 0px;
      }
    }
  }
  .preview-img{
    width:100%;
  }
  .w-100 {
    min-width: 100px;
    max-width: 100px;
  }
}
</style>
