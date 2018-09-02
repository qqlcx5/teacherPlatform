<template lang="html">
  <div class="knowledge" v-mathjax style="margin-bottom: 30px;" v-if="!data.hidden">
    <v-content-extand :show-btn="!isView && isExistChildren(data.children)" style="padding-left: 0;">
      <template slot="btns">
        <span class="m-content-expand__btn" v-if="!data.children" @click="handlePointModalVisible(true)">添加知识引入</span>
        <!-- <span class="m-content-expand__btn" @click="handleEditPointModalVisible(true)">编辑</span> -->
      </template>
      <div class="knowledge-name cat-name">
        <i class="lecture-icon iconfont icon-biaoqian1"></i>
        <span style="margin-left: 5px;">{{data.templateName}}</span>
      </div>
    </v-content-extand>
    <v-content-extand :show-btn="!isView" style="padding-left: 0;" v-if="data.children">
      <template slot="btns">
        <div>
          <span class="m-content-expand__btn" @click="handleEditPointModalVisible(true)">编辑</span>
          <span class="m-content-expand__btn" @click="handleRemoveTemplate(data.children[0])">删除</span>
        </div>
      </template>
      <div class="knowledge-name cat-name">
        <div style="margin-left: 20px;" class="body" v-for="item in data.children" :key="data.id">
          <div class="textbook-detail-item__content" v-html="updateImgSrc(data.children[0].richText.content)"></div>
        </div>
      </div>
    </v-content-extand>
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
        <el-button size="small" type="primary" @click="setContent">确 定</el-button>
      </span>
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
import mixin from '@/components/mixins'
import api from '@/api/lecture'
import { formatValidate, sizeValidate } from '@/utils/_fileValidate'
import http from '@/utils/fetch.js'
import vContentExtand from '@/components/content-expand'

export default {
  name: 'introduction',
  mixins: [mixin],
  components: { vContentExtand },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      lectureId: this.data.lectureId,
      uploadUrl: http.defaults.baseURL + `/lecture/${this.lectureId}/upload`,
      modalVisible: false,
      editModalVisible: false,
      filterText: '',
      treeList: [],
      preface: {
        content: ''
      },
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      dialogExplainForm: {
        content: null,
        pictureList: [],
        chartImgs: []
      },
      formatLimit: ['jpg', 'png', 'jpeg'],
      fileLengthLimit: 5,
      sizeLimit: 2
    }
  },
  computed: {
    isView() {
      return this.$route.query.type === 'view'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.pointTree.filter(val)
    }
  },
  methods: {
    // 删除 设定知识点
    handlePointModalClose(flag) {
      this.filterText = ''
      // TODO: 关闭前 先清除 数据 同时要保证编辑状态下已有的哪些不被清除
      this.modalVisible = flag
    },
    async setContent() {
      // TODO: 设定新的知识引入 调用后台接口，成功后
      let pictureList = this.preface.pictureList.map(item => item.id)
      let res = await api.addRichText({
        lectureId: this.lectureId,
        templateId: this.data.id,
        originalContent: this.preface.originalContent,
        pictureList: pictureList
      })
      if (res.success) {
        this.$emit('refresh')
        this.handlePointModalClose(false)
      }
      // this.data.children[0].richText = Object.assign(this.data.children[0].richText, this.preface)
      // this.handlePointModalClose(false)
    },
    async getPointTree() {
      let res = await api.getLecturePointTree({ lectureId: this.lectureId })
      this.treeList = res.data.list
    },
    // 知识树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.nodeName.indexOf(value.trim()) !== -1
    },
    handleNodeClick(node) {
      this.getExplain(node.nodeId)
    },
    async getExplain(pointId) {
      try {
        let res = await api.getExplainByPointId({
          pointId: pointId,
          type: 'PREFACE'
        })
        if (!res.success) {
          this.$message({ type: 'error', message: res.message || '' })
        }
        this.preface = Object.assign({}, this.preface, res.data)
      } catch (e) {
        this.$message({ type: 'error', message: e.message || '' })
      }
    },
    // 添加知识点引入 弹框
    handlePointModalVisible(flag) {
      this.modalVisible = !!flag
    },
    // 弹出知识点引入编辑框
    handleEditPointModalVisible(flag) {
      if (this.data.children.length) {
        this.dialogExplainForm = Object.assign(
          {},
          this.data.children[0].richText
        )
        this.editModalVisible = !!flag
      } else {
        this.$message.warning('无知识点引入，请先添加')
      }
    },
    beforeUpload(file) {
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
    handleSuccess(response, file) {
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
        this.dialogExplainForm.originalContent =
          this.dialogExplainForm.originalContent.slice(0, start) +
          '@{' +
          item.id +
          '}' +
          this.dialogExplainForm.originalContent.slice(end)
        this.dialogExplainForm.pictureList.push(file)
      } else {
        this.$message.error('上传图片失败')
      }
    },
    // 上传图片
    handleRemove(file, fileList) {
      if (file.status !== 'success') {
        return
      }
      if (file.id) {
        this.dialogExplainForm.originalContent = this.dialogExplainForm.originalContent.replace(
          `@{${file.id}}`,
          ''
        )
        let idx = this.dialogExplainForm.pictureList.indexOf(file)
        this.dialogExplainForm.pictureList.splice(idx, 1)
        return
      }
      if (!(file.response && file.response.success)) {
        this.$message.error(file.response.message || '上传图片失败')
        return
      }
      let item =
        file.response.data &&
        file.response.data.list &&
        file.response.data.list[0]
      this.dialogExplainForm.originalContent = this.dialogExplainForm.originalContent.replace(
        `@{${item.id}}`,
        ''
      )
      let idx = this.dialogExplainForm.pictureList.indexOf(file)
      this.dialogExplainForm.pictureList.splice(idx, 1)
    },
    handleEditFormCancel() {
      this.dialogExplainForm = {}
      this.handleEditPointModalClose(false)
    },
    handleEditPointModalClose(flag) {
      this.editModalVisible = flag
    },
    async submitEditForm() {
      if (!this.dialogExplainForm.originalContent.toString().trim()) {
        return this.$message.warning('请输入知识引入...')
      }
      let pictureList = this.dialogExplainForm.pictureList.map(item => item.id)
      let res = await api.updateRichText({
        contentTextId: this.dialogExplainForm.contentTextId,
        lectureTemplateId: this.dialogExplainForm.lectureTemplateId,
        originalContent: this.dialogExplainForm.originalContent,
        pictureList: pictureList
      })
      if (res.success) {
        this.dialogExplainForm = {}
        this.$emit('refresh')
        this.editModalVisible = false
      }
    },
    replaceImages2Content(pictureList, originalContent) {
      let content = originalContent
      if (pictureList instanceof Array && pictureList.length) {
        pictureList.forEach(pic => {
          let imageDom = '<br/><img src="' + pic.url + '"/>'
          content = content.replace(`@{${pic.id}}`, imageDom)
        })
      }
      return content
    },
    isExistChildren(item) {
      return !item
    },
    async handleRemoveTemplate(item) {
      try {
        await this.$confirm('确定删除知识引入？')
        let res = await api.deleteTemplate(item.id)
        if (res.success) {
          this.$emit('refresh')
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    }
  },
  mounted() {
    this.getPointTree()
  }
}
</script>

<style lang="less">
.title {
  position: relative;

  .btn-group {
    position: absolute;
    right: 0;
    top: 0;
    display: none;
  }
}

.hover-show {
  border: 1px solid transparent;
  border-radius: 4px;
  transition: border-color 0.2s linear;

  &:hover {
    border-color: #409eff;

    .btn-group {
      display: block;
    }
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
