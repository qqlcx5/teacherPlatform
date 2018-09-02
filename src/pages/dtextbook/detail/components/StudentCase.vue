<template lang="html">
  <div class="stu-case">
    <div class="teach-case-contont" v-if="lectureInfoObj">
      <v-lecture-readonly :data="lectureInfoObj" />
      <div class="tb-detail-main-actions">
        <el-button type="danger" size="mini" @click="publicLecture">定稿</el-button>
        <el-button type="primary" size="mini" @click="editLecture">编辑</el-button>
        <el-button type="success" size="mini">复制到</el-button>
        <i class="iconfont icon-quanping fullscreen" @click="openPreviewDialog"></i>
      </div>
    </div>
    <v-empty v-show="!lectureInfoObj" :btns="emptyBtns" tip="暂无数据"/>
    <v-preview :visible.sync="previewLectureVisible" :data="lectureInfoObj" />
  </div>
</template>

<script>
import vEmpty from './Empty'
import vLectureReadonly from './LectureReadonly'
import { dtextbook, lecture } from '@/api'
import vPreview from './Preview'

export default {
  name: 'StudentCase',
  components: {
    vEmpty,
    vLectureReadonly,
    vPreview
  },
  inject: ['currentChapter'],
  data() {
    return {
      emptyBtns: [
        {
          name: '立即创建',
          clickHandler: () => {
            this.create()
          }
        }
      ],
      lectureInfoObj: null,
      empty: true,
      chapterId: this.currentChapter.id,
      lectureId: '',
      loading: false,
      activeName: 'STUDENT_TEXTBOOK',
      previewLectureVisible: false
    }
  },
  watch: {
    'currentChapter.id'(val) {
      if (val && this.chapterId !== val) {
        this.chapterId = val
        this.getLecture(this.activeName)
      }
    }
  },
  methods: {
    async getLecture(name) {
      try {
        this.lectureInfoObj = null
        this.loading = true
        if (!this.chapterId) {
          this.$message.info('请先选择左侧的章节！')
          return null
        }
        let res = await dtextbook.getLecture(this.chapterId, name)
        if (!res.data) {
          // console.log('请返回正确的数据格式！')
          return null
        }
        this.lectureInfoObj = res && res.data && res.data.lectureTemplateVo
        this.lectureId = this.lectureInfoObj.id
        this.empty = false
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$message.error(e)
      }
    },
    async create() {
      try {
        this.chapterId = this.currentChapter.id
        if (!this.chapterId) {
          this.$message.info('请先选择左侧的章节！')
          return null
        }
        let res = await dtextbook.createLecture(this.chapterId, this.activeName)
        this.lectureId = res && res.data
        if (!this.lectureId) {
          this.$message.error('未生成相对应的讲义ID, 请联系对应的人员...')
          return null
        }
        this.editLecture()
      } catch (e) {
        this.$message.error(e)
      }
    },
    editLecture() {
      this.$router.push({
        name: 'DTextBook_detail_mainTeachingCase',
        params: {
          id: this.$route.params.id,
          chapterId: this.chapterId,
          lectureId: this.lectureId
        },
        query: {
          type: this.activeName
        }
      })
    },
    // 定稿 （讲义发布）
    async publicLecture() {
      try {
        await this.$confirm('确定定稿？')
        let res = await lecture.publishLecture({lectureId: this.lectureId})
        if (res.success) {
          this.$message.success(res.message || '定稿成功')
          // this.$emit('refresh')
        }
      } catch (e) {
        e !== 'cancel' && this.$message.error(e.message)
      }
    },
    // 全屏展示讲义
    openPreviewDialog() {
      this.previewLectureVisible = true
    }
  },
  mounted() {
    this.getLecture(this.activeName)
  }
}
</script>

<style lang="less">
.fullscreen {
  position: relative;
  top: 4px;
  left: 10px;
  font-size: 20px;
  cursor: pointer;
}
</style>
