<template>
  <div class="tb-courseware">
    <div class="tb-courseware-default" v-if="list.length === 0">
      <img src="/static/tab-default.png" alt="">
      <span>暂时没有课件数据</span>
    </div>
    <div class="tb-courseware-list" v-else>
      <div class="tb-courseware-item" v-for="item in list" :key="item.id">
        <div class="tb-courseware-item__video">
          <img :src="item.thumbnailPath" alt="" class="tb-courseware-item__thumbnaill">
          <div class="tb-courseware-item__mask" @click="getChapterVideo(item.id)">
            <i class="tb-courseware-item__icon el-icon-caret-right"></i>
          </div>
        </div>
        <div class="tb-courseware-item__content">
          <div class="tb-courseware-item__title">{{item.name}}</div>
          <div class="tb-courseware-item__tags">
            <span v-if="item.gradeName">{{item.gradeName}}</span>
            <span v-if="item.yearName">{{item.yearName}}</span>
            <span v-if="item.regionName">{{item.regionName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { textbook } from '../../../api'
export default {
  props: {
    chapterId: [Number, String]
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    chapterId(val) {
      if (val) this.getChapterCourseware(this.chapterId)
    }
  },
  created() {
    if (this.chapterId) this.getChapterCourseware(this.chapterId)
  },
  methods: {
    async getChapterCourseware(chapterId) {
      try {
        let res = await textbook.getChapterCourseware(chapterId)
        if (!res.data) this.list = []
        if (res.data && Array.isArray(res.data)) this.list = res.data
      } catch (e) {
        this.$message.error(e)
      }
    },
    async getChapterVideo(id) {
      let myWindow = window.open()
      try {
        let res = await textbook.getChapterVideo(id)
        if (res.success) {
          myWindow.location.href = res.data
        } else {
          myWindow.close()
          this.$message.error(res.message || 'Fail...')
        }
      } catch (e) {
        myWindow.close()
        this.$message.error(e.message || 'Fail...')
      }
    }
  }
}
</script>

<style lang="less">
.tb-courseware {
  &-default {
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
  &-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 15px;
  }
  &-item {
    border: 1px solid #e9eaec;
    overflow: hidden;
    &__video {
      position: relative;
    }
    &__thumbnaill {
      width: 100%;
      display: block;
    }
    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      cursor: pointer;
      justify-content: center;
      align-items: center;
      display: none;
    }
    &__video:hover &__mask {
      display: flex;
    }
    &__icon {
      font-size: 42px;
      color: #fff;
    }
    &__content {
      padding: 10px;
      font-size: 12px;
    }
    &__title,
    &__tags {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &__tags {
      span + span {
        margin-left: 5px;
        &::before{
          content: '|';
          margin-right: 5px;
          position: relative;
          top: -1px;
        }
      }
    }
  }
}
</style>
