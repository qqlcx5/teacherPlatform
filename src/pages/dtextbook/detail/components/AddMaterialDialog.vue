<template>
  <el-dialog title="添加素材" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" center width="800px">
    <div class="add-material-hd">
      <span style="font-weight: bold">素材内容</span>
      <div>
        <el-switch v-model="isPreview" active-color="#1B8CF2" inactive-color="#D4E7F8" active-text="预览模式" inactive-text="编辑模式">
        </el-switch>
      </div>
    </div>
    <div class="add-material-bd" style="margin-top: 10px">
      <el-input type="textarea" ref="textarea" :autosize="{ minRows: 6 }" placeholder="请输入" v-model="materialContent" v-show="!isPreview" />
      <pre class="add-material-prebox" v-mathjax v-html="preMaterialContent" v-show="isPreview"></pre>
    </div>
    <div class="add-material-ft" v-show="!isPreview">
      <el-upload :before-upload="beforeUpload" :file-list="list" accept=".jpg,.png" ref="uploader" :action="uploadUrl" list-type="picture-card" class="add-material-upload mt-20" :on-success="uploadSuccess" :on-remove="handlerRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过{{sizeLimit}}</div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit" :loading="loading">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/utils/fetch.js'
import { textbook } from '@/api'
import utils from '@/utils'
export default {
  props: {
    visible: Boolean,
    type: {
      type: String,
      default: 'create'
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['currentChapter', 'textbookId'],
  data() {
    return {
      loading: false,
      uploadUrl: http.defaults.baseURL + `/common/upload/contentImage`,
      materialContent: '',
      textbookChapterId: '',
      isPreview: false,
      list: [],
      sizeLimit: '200k'
    }
  },
  computed: {
    preMaterialContent(val) {
      let str = this.materialContent
      this.list.forEach(v => {
        let img = `<img src="${v.url}" />`
        let reg = new RegExp(`@{${v.id}}`, 'g')
        str = str.replace(reg, img)
      })
      return str
    }
  },
  watch: {
    visible(val) {
      if (val && this.type === 'edit') {
        this.getDTextbookMaterialDetail()
      }
    }
  },
  methods: {
    handleClose() {
      this.isPreview = false
      this.materialContent = ''
      this.list = []
      this.$nextTick(() => {
        this.$refs.uploader.clearFiles()
      })
      this.$emit('update:visible', !this.visible)
    },
    // 获取素材详情
    async getDTextbookMaterialDetail() {
      if (!this.data.chapterMaterialId) return
      try {
        let res = await textbook.getDTextbookMaterialDetail(
          this.data.chapterMaterialId
        )
        this.list = res.data.images
        this.materialContent = res.data.materialContent
      } catch (e) {
        this.$message.error(e)
      }
    },
    uploadSuccess(response, file, fileList) {
      if (!response.success) {
        return
      }
      let { uid, status, response: { data: [{ id, url }] } } = file
      let img = { uid, id, status, url }
      this.list.push(img)
      this.$nextTick(() => {
        const ele = this.$refs.textarea.$refs.textarea
        const start = ele.selectionStart
        const end = ele.selectionEnd
        this.materialContent =
          this.materialContent.slice(0, start) +
          `@{${id}}` +
          this.materialContent.slice(end)
      })
    },
    handlerRemove(file, fileList) {
      if (file.id) {
        let reg = new RegExp(`@{${file.id}}`, 'g')
        this.materialContent = this.materialContent.replace(reg, '')
        const idx = this.list.findIndex(v => v.id === file.id)
        idx > -1 && this.list.splice(idx, 1)
      }
    },
    async onUpdate() {
      try {
        const imageIds = this.list.map(v => v.id)
        await textbook.updateDTextbookMaterial({
          chapterMaterialId: this.data.chapterMaterialId,
          imageIds: imageIds,
          materialContent: this.materialContent,
          textId: this.data.textId
        })
      } catch (e) {
        this.$message.error(e)
      }
    },
    async onCreate() {
      try {
        const imageIds = this.list.map(v => v.id)
        await textbook.addDTextbookMaterial({
          imageIds,
          materialContent: this.materialContent,
          textbookChapterId: this.currentChapter.id
        })
      } catch (e) {
        this.$message.error(e)
      }
    },
    async submit() {
      if (!this.materialContent.trim()) {
        return this.$message.error('素材内容不能为空！')
      }
      this.loading = true
      if (this.type === 'create') {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }
      this.loading = false
      this.handleClose()
      this.$emit('on-success')
    },
    beforeUpload (file) {
      let sizeLimit = utils.convertToByte(this.sizeLimit)
      if (file.size > sizeLimit) {
        this.$message.error(`图片大小不能超过${this.sizeLimit}`)
        return false
      }
      return true
    }
  }
}
</script>

<style lang="postcss">
.add-material-hd {
  display: flex;
  justify-content: space-between;
}
.add-material-upload-btn {
  color: var(--blue);
}
.add-material-upload-tip {
  color: var(--gray-lighter);
}
.add-material-upload .el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}
.add-material-upload .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 85px;
}
.add-material-prebox {
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  min-height: 138px;
  box-sizing: border-box;
}
.add-material-prebox img {
  display: block;
}
</style>
