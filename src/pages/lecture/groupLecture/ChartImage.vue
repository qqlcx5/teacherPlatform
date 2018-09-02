<template lang="html">
  <div class="chart-image" v-mathjax v-if="!data.hidden">
    <v-content-extand :show-btn="!isView && isExistChildren(data.children)" style="padding-left: 0;">
      <template slot="btns">
        <span class="m-content-expand__btn" @click="handleModalVisible(true, 'new')">上传框图</span>
      </template>
      <div class="knowledge-name cat-name">
        <div class="body">
          <i class="lecture-icon iconfont icon-biaoqian1"></i>
          <span style="margin-left: 5px;">{{data.templateName}}</span>
        </div>
      </div>
    </v-content-extand>
    <v-content-extand :show-btn="!isView" style="padding-left: 0;" v-if="data.children">
      <template slot="btns">
        <div>
          <span class="m-content-expand__btn" @click="handleModalVisible(true, 'edit')">编辑</span>
          <span class="m-content-expand__btn" @click="handleRemoveTemplate(data.children[0])">删除</span>
        </div>
      </template>
      <div class="knowledge-name cat-name">
        <div style="margin-left: 20px; margin-top: 5px;" class="body">
          <div class="textbook-detail-item__content">
            <img :src="updateImgSrc(contentImageObj.url, false)" alt="">
          </div>
        </div>
      </div>
    </v-content-extand>
    <!-- 上传框图弹出框 -->
    <el-dialog
      :visible.sync="modalVisible"
      :title="title"
      custom-class="twp-dialog">
      <el-form
        label-width="100px"
        class="set-point-form">
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
            :file-list="chartImgs"
            :limit="1">
            <el-button icon="el-icon-upload2" plain size="small" type="primary">点击上传框图</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel">取 消</el-button>
        <el-button size="small" type="primary" @click.prevent="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片 -->
    <el-dialog
      :size="imgViewerSize"
      :visible.sync="showImageModal">
      <img :src="imageUrl" @dblclick="scaleImage" alt="" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/components/mixins'
// import api from '@/api/lecture'
import { formatValidate, sizeValidate } from '@/utils/_fileValidate'
import http from '@/utils/fetch.js'
import { lecture } from '@/api'
import vContentExtand from '@/components/content-expand'

export default {
  name: 'chartImgs',
  components: { vContentExtand },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mixins: [mixin],
  data() {
    return {
      lectureId: this.data.lectureId,
      uploadUrl: http.defaults.baseURL + `/lecture/${this.lectureId}/upload`,
      modalVisible: false,
      chartImgs: [],
      chartImgUrl: '',
      showImageModal: false,
      imgViewerSize: '',
      formatLimit: ['jpg', 'png', 'jpeg'],
      fileLengthLimit: 5,
      sizeLimit: 500, // KB
      imageUrl: '',
      title: '上传知识框图'
    }
  },
  computed: {
    type() {
      if (this.data && this.data.children) {
        this.title = '编辑知识框图'
        return 'edit'
      }
      return 'new'
    },
    contentImageObj() {
      if (this.type === 'new') {
        return ''
      }
      return (this.data.children && this.data.children[0].contentImage) || ''
    },
    lectureTemplateId() {
      if (this.type === 'new') {
        return ''
      }
      return this.data.children[0].id
    },
    isView() {
      return this.$route.query.type === 'view'
    }
  },
  methods: {
    handleModalVisible(flag, type) {
      if (type === 'edit' && this.contentImageObj) {
        this.chartImgs = [this.contentImageObj]
        this.chartImgUrl = this.contentImageObj.url
      } else {
        this.chartImgs = []
        this.chartImgUrl = ''
      }
      this.modalVisible = flag
    },
    handleCancel() {
      this.modalVisible = false
    },
    submitForm() {
      if (this.chartImgs.length === 0) {
        this.$message.error('请选择图片')
        return
      }
      if (this.type === 'new') {
        this.addImage()
      } else {
        this.updateImage()
      }
    },
    async addImage() {
      try {
        let pictureId = this.chartImgs[0].id
        let params = {
          lectureId: this.lectureId,
          templateId: this.data.id,
          pictureList: [pictureId]
        }
        let res = await lecture.addImage(params)
        if (res.success) {
          this.$emit('refresh')
          this.modalVisible = false
        }
      } catch (e) {
        this.$message.error(e.message || '提交失败')
      }
    },
    async updateImage() {
      try {
        let params = {
          lectureId: this.lectureId,
          lectureTemplateId: this.data.children[0].id,
          pictureId: (this.chartImgs[0] && this.chartImgs[0].id) || ''
        }
        let res = await lecture.updateImage(params)
        if (res.success) {
          this.$emit('refresh')
          this.modalVisible = false
        }
      } catch (e) {
        this.$message.error(e.message || '提交失败')
      }
    },
    // 放大图片
    scaleImage() {
      if (this.imgViewerSize) {
        this.imgViewerSize = ''
      } else {
        this.imgViewerSize = 'large'
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
    handleChartImgSuccess(res, file) {
      if (res.success && res.data.list.length) {
        let item = res.data.list[0]
        file.url = item.url || ''
        file.id = item.id
        file.refId = item.refId
        this.chartImgs = [file]
        this.chartImgUrl = file.url
      } else {
        this.$message.error('上传图片失败')
      }
    },
    handleChartImgRemove(file) {
      this.chartImgUrl = ''
      this.$set(this, 'chartImgs', [])
    },
    beforeUpload(file) {
      let formatCheck = formatValidate(file, this.formatLimit)
      let sizeCheck = sizeValidate(file, this.sizeLimit, 'KB')
      if (!formatCheck) {
        this.$message.error(`图片只支持${this.formatLimit.join('/')}格式`)
        return false
      }
      if (!sizeCheck) {
        this.$message.error(`图片大小不能超过${this.sizeLimit}KB`)
        return false
      }
      return true
    },
    isExistChildren(item) {
      return !item
    },
    async handleRemoveTemplate(item) {
      try {
        await this.$confirm('确定删除框图？')
        let res = await lecture.deleteTemplate(item.id)
        if (res.success) {
          this.$emit('refresh')
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e)
      }
    }
  },
  mounted() {}
}
</script>

<style lang="less">
.chart-image {
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
}
</style>
