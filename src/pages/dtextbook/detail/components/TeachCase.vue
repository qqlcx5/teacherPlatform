<template>
  <div class="teach-case">
    <!-- tagType: MAIN_TEACHING_CASE | PREPARATION | CLASS_INTERACTION | POST_TEST | ENTRANCE_TEST | STUDENT_TEXTBOOK
    分别对应： 主师教案, 预习及预测, 课中互动题, 课后测, 入门测, 学生教材 -->
    <el-tabs class="hi-tabs" v-model="activeName" v-loading="loading" @tab-click="handleClick" style="height: 100%; display: flex; flex-direction: column;">
      <el-tab-pane label="主师教案" name="MAIN_TEACHING_CASE" style="height: 100%;">
        <div class="teach-case-contont" v-if="lectureInfoObj">
          <v-lecture-readonly :data="lectureInfoObj" />
          <div class="tb-detail-main-actions">
            <el-button type="danger" size="mini" @click="publicLecture" v-if="lectureStatus === 'AVAILABLE'">定稿</el-button>
            <el-button type="primary" size="mini" @click="editLecture" v-if="lectureStatus === 'AVAILABLE'">编辑</el-button>
            <el-button type="success" size="mini" @click="copyTo">复制到</el-button>
            <el-button type="warning" size="mini" @click="upgradeLecture" v-if="lectureStatus === 'DISABLED'">升级</el-button>
            <i class="iconfont icon-quanping fullscreen" @click="openPreviewDialog"></i>
          </div>
        </div>
        <v-empty v-if="!lectureInfoObj" :btns="emptyBtns" tip="暂无数据" />
      </el-tab-pane>
      <el-tab-pane label="预习及预测" name="PREPARATION" style="height: 100%;">
        <div class="teach-case-contont" v-if="lectureInfoObj">
          <v-lecture-readonly :data="lectureInfoObj" />
          <div class="tb-detail-main-actions">
            <el-button type="danger" size="mini" @click="publicLecture" v-if="lectureStatus === 'AVAILABLE'">定稿</el-button>
            <el-button type="primary" size="mini" @click="editLecture" v-if="lectureStatus === 'AVAILABLE'">编辑</el-button>
            <el-button type="success" size="mini" @click="copyTo">复制到</el-button>
            <el-button type="warning" size="mini" @click="upgradeLecture" v-if="lectureStatus === 'DISABLED'">升级</el-button>
            <i class="iconfont icon-quanping fullscreen" @click="openPreviewDialog"></i>
          </div>
        </div>
        <v-empty v-show="!lectureInfoObj" :btns="emptyBtns" tip="暂无数据" />
      </el-tab-pane>
      <el-tab-pane label="课中互动题" name="CLASS_INTERACTION" style="height: 100%;">
        <div class="teach-case-contont" v-if="lectureInfoObj">
          <v-lecture-readonly :data="lectureInfoObj" />
          <div class="tb-detail-main-actions">
            <el-button type="danger" size="mini" @click="publicLecture" v-if="lectureStatus === 'AVAILABLE'">定稿</el-button>
            <el-button type="primary" size="mini" @click="editLecture" v-if="lectureStatus === 'AVAILABLE'">编辑</el-button>
            <el-button type="success" size="mini" @click="copyTo">复制到</el-button>
            <el-button type="warning" size="mini" @click="upgradeLecture" v-if="lectureStatus === 'DISABLED'">升级</el-button>
            <i class="iconfont icon-quanping fullscreen" @click="openPreviewDialog"></i>
          </div>
        </div>
        <v-empty v-if="!lectureInfoObj" :btns="emptyBtns" tip="暂无数据" />
      </el-tab-pane>
      <el-tab-pane label="课后测" name="POST_TEST" style="height: 100%;">
        <div class="teach-case-contont" v-if="lectureInfoObj">
          <v-lecture-readonly :data="lectureInfoObj" />
          <div class="tb-detail-main-actions">
            <el-button type="danger" size="mini" @click="publicLecture" v-if="lectureStatus === 'AVAILABLE'">定稿</el-button>
            <el-button type="primary" size="mini" @click="editLecture" v-if="lectureStatus === 'AVAILABLE'">编辑</el-button>
            <el-button type="success" size="mini" @click="copyTo">复制到</el-button>
            <el-button type="warning" size="mini" @click="upgradeLecture" v-if="lectureStatus === 'DISABLED'">升级</el-button>
            <i class="iconfont icon-quanping fullscreen" @click="openPreviewDialog"></i>
          </div>
        </div>
        <v-empty v-if="!lectureInfoObj" :btns="emptyBtns" tip="暂无数据" />
      </el-tab-pane>
      <el-tab-pane label="入门测" name="ENTRANCE_TEST" style="height: 100%;">
        <div class="teach-case-contont" v-if="lectureInfoObj">
          <v-lecture-readonly :data="lectureInfoObj" />
          <div class="tb-detail-main-actions">
            <el-button type="danger" size="mini" @click="publicLecture" v-if="lectureStatus === 'AVAILABLE'">定稿</el-button>
            <el-button type="primary" size="mini" @click="editLecture" v-if="lectureStatus === 'AVAILABLE'">编辑</el-button>
            <el-button type="success" size="mini" @click="copyTo">复制到</el-button>
            <el-button type="warning" size="mini" @click="upgradeLecture" v-if="lectureStatus === 'DISABLED'">升级</el-button>
            <i class="iconfont icon-quanping fullscreen" @click="openPreviewDialog"></i>
          </div>
        </div>
        <v-empty v-if="!lectureInfoObj" :btns="emptyBtns" tip="暂无数据" />
      </el-tab-pane>
    </el-tabs>
    <copy-lecture-dialog :visible.sync="copyLectureTo" :active-name="activeName" :chapter-id="chapterId" :lecture-id="lectureId" />
    <v-preview :visible.sync="previewLectureVisible" :data="lectureInfoObj" />
  </div>
</template>
<script>
import vEmpty from './Empty'
import vLectureReadonly from './LectureReadonly'
import CopyLectureDialog from './CopyLectureDialog'
import { dtextbook, lecture } from '@/api'
import vPreview from './Preview'

export default {
  components: {
    vEmpty,
    vLectureReadonly,
    CopyLectureDialog,
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
      lectureInfoObj: {},
      empty: true,
      chapterId: this.currentChapter.id,
      lectureId: '',
      loading: false,
      activeName: 'MAIN_TEACHING_CASE',
      copyLectureTo: false,
      lectureStatus: '',
      lectureName: '',
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
        if (!this.chapterId) {
          return
        }
        this.lectureInfoObj = null
        this.loading = true
        let res = await dtextbook.getLecture(this.chapterId, name)
        if (!res.data) {
          // console.log('请返回正确的数据格式！')
          return null
        }
        this.lectureInfoObj = res && res.data && res.data.lectureTemplateVo
        this.lectureName = this.lectureInfoObj.lectureName
        this.lectureId = this.lectureInfoObj.id
        this.empty = false
        this.lectureStatus = this.lectureInfoObj.lectureStatus
      } catch (e) {
        this.$message.error(e)
      } finally {
        this.loading = false
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
        await this.$confirm('确定定稿？', { type: 'warning' })
        let res = await lecture.publishLecture({ lectureId: this.lectureId })
        if (res.success) {
          this.$message.success(res.message || '定稿成功')
          // this.$emit('refresh')
        }
        this.getLecture(this.activeName)
      } catch (e) {
        e !== 'cancel' && this.$message.error(e.message)
      }
    },
    handleClick(tab) {
      this.activeName = tab.name
      this.getLecture(tab.name)
    },
    copyTo() {
      this.copyLectureTo = true
    },
    async upgradeLecture() {
      try {
        await this.$confirm('此操作将升级教案,是否继续？')
        let res = await dtextbook.upgradeLecture({
          id: this.chapterId,
          lectureId: this.lectureId,
          tagType: this.activeName
        })
        if (res.success) {
          this.lectureId = res.data
        }
        await this.$confirm(this.lectureName + '将升级')
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
.teach-case-contont {
  display: flex;
  /* flex: 1; */
  flex-direction: column;
  height: 100%;

  .material {
    flex: 1;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
    }
  }

  .el-tabs__content {
    flex: 1 !important;
  }
}
.fullscreen {
  position: relative;
  top: 4px;
  left: 10px;
  font-size: 20px;
  cursor: pointer;
}
</style>
