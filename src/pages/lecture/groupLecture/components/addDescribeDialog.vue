<template lang="html">
  <!-- 编辑知识引入 -->
  <el-dialog :visible="visible" :title="title" custom-class="twp-dialog"
    class="add-knowledge-des-dialog" :before-close="handleClose">
    <el-form label-width="100px" class="set-point-form">
      <el-form-item label="描述:" prop="originalContent">
        <el-input ref="inputRef" placeholder="请输入描述..." type="textarea" :rows="6"
          size="small" v-model="validateData.originalContent">
        </el-input>
      </el-form-item>
      <el-form-item label="上传图片:">
        <el-upload :before-upload="beforeUpload" :accept="'.'+formatLimit.join(',.')"
          class="original-content" :action="uploadUrl" :on-success="handleSuccess"
          :on-remove="handleRemove" multiple :file-list="validateData.pictureList"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click.prevent="save" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import mixin from '@/components/mixins'
import api from '@/api/lecture'
import { formatValidate, sizeValidate } from '@/utils/_fileValidate'
import http from '@/utils/fetch.js'

export default {
  name: 'custome-describe-dialog',
  props: {
    visible: Boolean,
    data: Object,
    lectureId: [String, Number],
    status: {
      type: String,
      default: 'new'
    },
    templateId: [String, Number]
  },
  data() {
    return {
      loading: false,
      uploadUrl: http.defaults.baseURL + `/lecture/${this.lectureId}/upload`,
      formatLimit: ['jpg', 'png', 'jpeg'],
      fileLengthLimit: 5,
      sizeLimit: 2,
      validateData: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.validateData = Object.assign({}, this.data)
      }
    }
  },
  computed: {
    title() {
      if (this.status === 'edit') {
        return '自定义目录——编辑描述'
      }
      return '自定义目录——添加描述'
    },
    disabled() {
      if (this.validateData.originalContent && !this.validateData.originalContent.toString().trim()) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('refresh')
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
    handleRemove(file, fileList) {
      if (file.status !== 'success') {
        return
      }
      if (file.id) {
        this.validateData.originalContent = this.validateData.originalContent.replace(`@{${file.id}}`, '')
        let idx = this.validateData.pictureList.indexOf(file)
        this.validateData.pictureList.splice(idx, 1)
        return
      }
      if (!(file.response && file.response.success)) {
        this.$message.error(file.response.message || '上传图片失败')
        return
      }
      let item = file.response.data && file.response.data.list && file.response.data.list[0]
      this.validateData.originalContent = this.validateData.originalContent.replace(`@{${item.id}}`, '')
      let idx = this.validateData.pictureList.indexOf(file)
      this.validateData.pictureList.splice(idx, 1)
    },
    handleSuccess (response, file) {
      if (response.success && response.data.list.length) {
        let start = 0
        let end = 0
        let element = this.$refs.inputRef.$el.querySelector('textarea')
        start = element.selectionStart
        end = element.selectionEnd
        let item = response.data.list[0]
        if (!this.validateData.originalContent) {
          this.validateData.originalContent = ''
        }
        file.url = item.url || ''
        file.id = item.id
        file.refId = item.refId
        this.validateData.originalContent = this.validateData.originalContent.slice(0, start) + '@{' + item.id + '}' + this.validateData.originalContent.slice(end)
        this.validateData.pictureList.push(file)
      } else {
        this.$message.error('上传图片失败')
      }
    },
    save() {
      if (!this.validateData.originalContent.toString().trim()) {
        return this.$message.warning('内容不能为空！')
      }
      if (this.status === 'edit') {
        this.updateRichText()
      } else {
        this.addRichText()
      }
    },
    async updateRichText() {
      this.loading = true
      let pictureList = this.validateData.pictureList.map(item => item.id)
      let params = Object.assign({}, this.validateData)
      params.pictureList = pictureList
      let res = await api.updateRichText(params)
      if (res.success) {
        this.$emit('refresh')
        this.$message(res.message || '修改成功')
        this.handleClose()
      }
      this.loading = false
    },
    async addRichText() {
      this.loading = true
      let pictureList = this.validateData.pictureList.map(item => item.id)
      let params = {
        lectureId: this.lectureId,
        templateId: this.templateId,
        pictureList: pictureList
      }
      params = Object.assign({}, this.validateData, params)
      let res = await api.addCustomRichText(params)
      if (res.success) {
        this.$emit('refresh')
        this.$message(res.message || '添加描述成功')
        this.handleClose()
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less">
</style>
