<template>
  <el-dialog :visible="visible" title="知识点——添加描述" custom-class="m-dialog" class="add-knowledge-des-dialog" center :before-close="handleClose">
    <el-tabs v-model="activeTab" type="card">
      <!-- 描述文字 -->
      <el-tab-pane label="文字" name="text">
        <div class="knowledge-des-txt" v-for="item in describes" :key="item.describeId">
          <el-checkbox v-model="item.defaultShow" :key="item.describeId"></el-checkbox>
          <div v-html="item.displayContent" v-mathjax></div>
        </div>
      </el-tab-pane>
      <!-- 音频列表 -->
      <el-tab-pane label="音频" name="audio">
        <el-table :data="audios" border style="width: 100%" size="mini">
          <el-table-column label="选择" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.defaultShow"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="audioName" label="文件名称"></el-table-column>
          <el-table-column label="文件归类" width="120" align="center">
            <span slot-scope="scope">解析</span>
          </el-table-column>
          <el-table-column label="文件大小" width="120" align="center">
            <span slot-scope="scope">{{convertFileSize(scope.row.fileLength)}}</span>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 视频列表 -->
      <el-tab-pane label="视频" name="video">
        <el-table :data="videos" border style="width: 100%" size="mini">
          <el-table-column label="选择" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.defaultShow"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="videoName" label="文件名称"></el-table-column>
          <el-table-column label="文件归类" width="120" align="center">
            <span slot-scope="scope">{{scope.row.useType === 'SPEAK' ? videoType(scope.row.courseTypeId) : '视频解析'}}</span>
          </el-table-column>
          <el-table-column label="文件大小" width="120" align="center">
            <span slot-scope="scope">{{convertFileSize(scope.row.fileLength)}}</span>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button type="primary" size="small" @click="save" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { lecture } from '@/api'
export default {
  props: {
    visible: Boolean,
    lectureId: [String, Number],
    pointId: [String, Number]
  },
  data() {
    return {
      activeTab: 'text',
      describes: [],
      audios: [],
      videos: [],
      courseTypeOptions: [],
      loading: false
    }
  },
  watch: {
    visible(val) {
      this.getDes()
    }
  },
  mounted() {
    this.getDictionary()
  },
  methods: {
    async getDictionary() {
      let res = await lecture.getDictionary({
        type: 'LECTURE',
        needUnchecked: false
      })
      if (res.success && Array.isArray(res.data)) {
        const record = res.data.find(v => v.key === 'courseTypeId')
        if (record) this.courseTypeOptions = record.list
      }
    },
    async getDes() {
      try {
        const res = await lecture.getKnwoledgeDesAndSummary(
          this.lectureId,
          this.pointId
        )
        if (!res.success) throw res.message
        this.describes = res.data.describes || []
        this.audios = res.data.audios || []
        this.videos = res.data.videos || []
      } catch (e) {
        this.$message.error(e)
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async save() {
      this.loading = true
      const audioIds = []
      const videoIds = []
      const describeIds = []
      this.audios.forEach(v => {
        if (v.defaultShow) audioIds.push(v.id)
      })
      this.videos.forEach(v => {
        if (v.defaultShow) videoIds.push(v.id)
      })
      this.describes.forEach(v => {
        if (v.defaultShow) describeIds.push(v.describeId)
      })
      try {
        const res = await lecture.updateKnowledgeDes({
          lectureId: this.lectureId,
          pointId: this.pointId,
          describeIds,
          audioIds,
          videoIds
        })
        if (res.success) {
          this.$emit('on-success')
          this.handleClose()
        }
      } catch (e) {
        this.$message.error(e)
      }
      this.loading = false
    },
    videoType(courseTypeId) {
      const record = this.courseTypeOptions.find(v => v.code === courseTypeId)
      return record ? record.label : ''
    },
    convertFileSize(size) {
      if (!size) return '-'
      let n = size / 1e6
      n = n.toFixed(2)
      return n + 'MB'
    }
  }
}
</script>

<style lang="less">
.add-knowledge-des-dialog{
  .knowledge-des-txt{
    display: flex;
    align-items: baseline;
    margin-bottom: 10px;
    &>div{
      flex: 1;
      margin-left: 20px;
      word-break: break-all;
    }
  }
}
</style>
