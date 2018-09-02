<template>
  <div class="tb-detail">
    <div class="tb-detail__hd">
      <h2 class="tb-detail-title">
        <span>{{baseInfo.name}}</span>
        <em>{{baseInfo.gradeName}}</em>
        <em>{{baseInfo.subjectName}}</em>
      </h2>
      <div class="tb-detail-tags">
        <span>课程季：{{baseInfo.seasonName}}</span>
        <span>类型：{{baseInfo.typeName}}</span>
        <span>年份：{{baseInfo.yearName}}</span>
        <span>地区：{{baseInfo.regionName}}</span>
        <span>产品线：{{baseInfo.productName}}</span>
        <span>来源部门：{{baseInfo.sourceDepartment}}</span>
      </div>
    </div>
    <div class="tb-detail__bd">
      <div class="tb-detail__content">
        <div class="tb-detail__left">
          <chapter-tree style="flex:1" :expand-keys="expandKeys" ref="chapterTree" :data="chapterTree" @node-click="handleNodeClick" />
        </div>
        <div class="tb-detail__right">
          <el-tabs type="border-card" v-model="tabName" class="tb-detail-tabs" style="flex:1;box-shadow:none;">
            <el-tab-pane label="讲义" name="lecture">
              <lecture :chapter-id="chapterId" v-if="tabName==='lecture'" class="tab-scroll-panel" />
            </el-tab-pane>
            <el-tab-pane label="课件" name="courseware">
              <courseware :chapter-id="chapterId" v-if="tabName==='courseware'" class="tab-scroll-panel" />
            </el-tab-pane>
            <!-- <el-tab-pane label="正课视频" name="video-right">
              <div v-if="tabName==='video-right'"></div>
            </el-tab-pane> -->
            <el-tab-pane label="说课视频" name="video-say">
              <v-video :chapter-id="chapterId" v-if="tabName==='video-say'" type="TEXTBOOK_CHAPTER_PREPARE_LESSON" class="tab-scroll-panel"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chapterTree from '../../../components/chapter-tree'
import courseware from './courseware'
import lecture from './lecture'
import vVideo from './video'
import { textbook } from '../../../api'
export default {
  components: {
    chapterTree,
    courseware,
    lecture,
    vVideo
  },
  data() {
    return {
      chapterTree: [],
      baseInfo: {},
      textbookId: this.$route.params.id,
      chapterId: '',
      tabName: 'lecture',
      checkedData: '',
      expandKeys: []
    }
  },
  mounted() {
    this.getChapterDetail(this.textbookId)
  },
  methods: {
    async getChapterDetail(id) {
      try {
        let res = await textbook.getChapterDetail(id)
        let { chapters, ...baseInfo } = res.data
        this.chapterTree = chapters
        if (
          chapters &&
          chapters[0].children &&
          chapters[0].children.length > 0
        ) {
          this.checkedData = chapters[0].children[0].id
          let treeEle = this.$refs['chapterTree'].$children[0]
          this.$nextTick(() => {
            treeEle.setCurrentKey(this.checkedData)
            this.expandKeys = [this.checkedData]
            this.chapterId = this.checkedData
          })
        }
        this.baseInfo = { ...baseInfo }
      } catch (e) {
        this.$message.error(e)
      }
    },
    handleNodeClick(data, node) {
      if (node.isLeaf) this.chapterId = data.id
    }
  }
}
</script>

<style lang="less">
.tb-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  &__hd,
  &__bd {
    background: #fff;
    border-radius: 4px;
    padding: 15px;
    border: 1px solid #e9eaec;
  }
  &__bd {
    margin-top: 15px;
    flex: 1;
    display: flex;
  }
  &-tabs {
    display: flex;
    flex-direction: column;
    .el-tabs__content {
      flex: 1;
    }
  }
  &__content {
    display: flex;
    flex: 1;
  }
  &__left {
    flex: 1;
    padding: 10px;
    margin-right: 15px;
    border: 1px solid #e9eaec;
    position: relative;
  }
  &__right {
    display: flex;
    flex: 4;
  }
  &-title {
    font-size: 12px;
    margin: 0;
    & > em {
      font-style: normal;
      padding: 3px 6px;
      border-radius: 2px;
      background: #3587ff;
      color: #fff;
      font-weight: 100;
      margin-left: 15px;
    }
  }
  &-tags {
    display: flex;
    margin-top: 10px;
    span {
      flex: 1;
      font-size: 12px;
    }
  }
}
.tb-detail-tab__default {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-scroll-panel {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  padding-right: 10px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #fff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: hsla(220, 4%, 58%, 0.3);
    display: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    display: block;
  }
}
</style>
