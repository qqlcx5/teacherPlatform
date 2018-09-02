<template>
  <div class="tb-video">
    <div class="tb-video-default" v-if="videos.length === 0">
      <img src="/static/tab-default.png" alt="">
      <span>暂时没有说课视频</span>
    </div>
    <div class="tb-video__wrapper" v-else>
      <div class="tb-video__left">
        <video class="tb-video-player" controls="controls" autoplay :src="videoUrl">
        </video>
      </div>
      <div class="tb-video__right">
        <el-button class="tb-video-btns" :title="item.videoName" :type="currentVideoIndex === index?'primary':'default'" v-for="(item, index) of videos" :key="item.id" @click.stop="selectVideo(item, index)">
          {{index + 1}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { textbook } from '../../../api'
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    chapterId: [Number, String]
  },
  data() {
    return {
      videoUrl: '',
      currentVideoIndex: 0,
      videos: []
    }
  },
  watch: {
    chapterId(val) {
      if (this.chapterId) {
        this.getVideos(this.chapterId, this.type)
      } else {
        this.videos = []
        this.videoUrl = ''
      }
    }
  },
  created() {
    if (this.chapterId) {
      this.getVideos(this.chapterId, this.type)
    } else {
      this.videos = []
      this.videoUrl = ''
    }
  },
  methods: {
    async getVideos(chapterId, type) {
      try {
        let res = await textbook.getVideos(chapterId, type)
        this.videos = res.data
        this.videoUrl = this.videos[0] ? this.videos[0].videoUrl : ''
      } catch (e) {
        this.$message.error(e)
      }
    },
    selectVideo(item, index) {
      this.currentVideoIndex = index
      this.videoUrl = item.videoUrl
    }
  }
}
</script>

<style lang="less">
.tb-video {
  &-default {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    span {
      color: #888;
      margin-top: 20px;
    }
  }
  &__wrapper {
    display: flex;
  }
  &__left {
    flex: 1;
  }
  &-player {
    background-color: #000;
    width: 100%;
  }
  &__right {
    display: flex;
    flex-direction: column;
  }
  &-btns {
    margin-left: 0;
    border-radius: 0px;
  }
}
</style>
