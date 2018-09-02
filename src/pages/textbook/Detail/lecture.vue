<template>
  <div class="tb-lecture" v-loading="loading">
    <div class="action-bar" v-if="chapterDetail.length">
      <p></p>
      <el-button type="primary" size="mini" class="copy-button"
        v-if="chapterDetail && chapterDetail.length > 0"
        @click="openCopyDialog">
        复制讲义
      </el-button>
    </div>
    <div class="tb-lecture-default" v-if="chapterDetail.length === 0">
      <img src="/static/tab-default.png" alt="">
      <span>暂时没有讲义数据</span>
    </div>
    <textbook-item :id="'step'+item.id" :data="item" v-for="item in chapterDetail" :key="item.id" v-else/>
    <v-copy-lecture-dialog :visible.sync="copyLectureVisible"
      :data="basicInfo"
      :lectureId="lectureId"
      :grade-list="gradeList"
      :course-list="courseList"
      :product-line-list="productLineList" />
  </div>
</template>

<script>
import { textbook } from '@/api'
import textbookItem from '../textbookItem'
import vCopyLectureDialog from './components/copyLectureDialog.vue'

export default {
  components: { textbookItem, vCopyLectureDialog },
  props: {
    chapterId: [Number, String]
  },
  data() {
    return {
      chapterDetail: [],
      copyLectureVisible: false,
      loading: false,
      lectureName: '',
      lectureId: '',
      basicInfo: Object.create(null)
    }
  },
  watch: {
    chapterId(val) {
      if (val) {
        this.$store.dispatch('getTopicSelectorData', 'LECTURE')
        this.getChapterLecture(val)
      }
    }
  },
  computed: {
    topicSelectOptions() {
      return this.$store.state.app.topicSelectOptions
    },
    gradeList() {
      return this.filterArrayByKey(this.topicSelectOptions, 'gradeId')
    },
    courseList() {
      return this.filterArrayByKey(this.topicSelectOptions, 'courseTypeId')
    },
    productLineList () {
      return this.filterArrayByKey(this.topicSelectOptions, 'productCode')
    }
  },
  created() {
    if (this.chapterId) this.getChapterLecture(this.chapterId)
  },
  methods: {
    async getChapterLecture(chapterId) {
      try {
        this.loading = true
        let res = await textbook.getChapterLecture(chapterId)
        if (!res.data) this.chapterDetail = []
        if (res.data && Array.isArray(res.data.lectureTemplateList)) {
          this.chapterDetail = res.data.lectureTemplateList
          this.lectureName = res.data.lectureName
          this.lectureId = res.data.id
          this.getLectureBasicinfo(res.data.id)
        }

        this.loading = false
      } catch (e) {
        this.$message.error(e)
      }
    },
    async getLectureBasicinfo(lectureId) {
      try {
        let res = await textbook.getLectureBasicinfo(lectureId)
        if (res.success) {
          let {name, gradeId, courseTypeId, productCode, subjectId, periodId, regionId} = res.data
          // name = name + '--副本'
          this.basicInfo = {name, gradeId, courseTypeId, productCode, subjectId, periodId, regionId}
        }
      } catch (e) {
        this.$message.error(e)
      }
    },
    openCopyDialog() {
      this.copyLectureVisible = true
    },
    filterArrayByKey(arr, key) {
      let record = arr.find(v => v.key === key)
      if (record) {
        let arr = [...record.list]
        arr.shift()
        return arr
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="less">
.tb-lecture{

  &-default{
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    span{
      color: #888;
      margin-top: 20px;
    }
  }

  // .copy-button {
  //   position: absolute;
  //   right: 0;
  //   top: -10px;
  // }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border: 1px solid #20a0ff;
    padding: 8px;
    margin-bottom: 20px;
  }
}
</style>
