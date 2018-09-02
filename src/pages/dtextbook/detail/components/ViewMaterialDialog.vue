<template>
  <el-dialog title="素材详情" :visible.sync="visible" :before-close="handleClose" custom-class="m-dialog" center width="800px">
    <pre v-html="preMaterialContent" v-mathjax></pre>
  </el-dialog>
</template>

<script>
import { textbook } from '@/api'

export default {
  props: {
    visible: Boolean,
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      materialContent: '',
      list: []
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
      if (val) {
        this.getDTextbookMaterialDetail()
      }
    }
  },
  methods: {
    handleClose() {
      this.materialContent = ''
      this.list = []
      this.$emit('update:visible', false)
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
