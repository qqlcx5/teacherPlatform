<template>
  <div class="knowledge-describe">
    <div class="knowledge-describe__item">
      <!-- <label class="knowledge-describe__label">描述：</label> -->
      <div class="knowledge-describe__con">
        <div class="knowledge-describe__txt has-icon" v-mathjax v-for="item in desTxt" v-if="item.pointDescribeVos && item.pointDescribeVos.displayContent" :key="item.id">
          <div v-html="item.pointDescribeVos.displayContent"></div>
        </div>
      </div>
    </div>
    <div class="knowledge-describe__item" v-if="audios.length > 0">
      <label class="knowledge-describe__label">音频解析：</label>
      <div class="knowledge-describe__con">
        <div class="knowledge-describe__audio" v-for="(item, index) in audios" :key="item.id" v-if="item.audio && item.audio.linkUrl">
          <el-popover placement="right" width="308" trigger="click" @hide="stopAudio(index)">
            <audio class="knowledge-describe__audio-ctr" controls :src="item.audio.linkUrl" :ref="`audio${index}`"></audio>
            <span slot="reference" class="knowledge-describe__media-name">{{item.audio.audioName}}</span>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="knowledge-describe__item" v-if="analyVideos.length > 0">
      <label class="knowledge-describe__label">视频解析：</label>
      <div class="knowledge-describe__con">
        <div class="knowledge-describe__video" v-for="item in analyVideos" v-if="item.video && item.video.videoName" :key="item.id">
          <span @click="playVideo(item)" class="knowledge-describe__media-name">{{item.video.videoName}}</span>
        </div>
      </div>
    </div>
    <div class="knowledge-describe__item" v-if="speakVideos.length > 0">
      <label class="knowledge-describe__label">视频讲法：</label>
      <div class="knowledge-describe__con">
        <div class="knowledge-describe__video" v-for="item in speakVideos" v-if="item.video && item.video.videoName" :key="item.id">
          <span @click="playVideo(item)" class="knowledge-describe__media-name">{{item.video.videoName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    desTxt() {
      return this.data.filter(v => v.contextType === 'DESCRIBE_TEXT')
    },
    audios() {
      return this.data.filter(v => v.contextType === 'AUDIO')
    },
    analyVideos() {
      return this.data.filter(v => v.contextType === 'VIDEO')
    },
    speakVideos() {
      return this.data.filter(v => v.contextType === 'VIDEO_SPEAK')
    }
  },
  methods: {
    playVideo(video) {
      window.open(`/#/video/${video.video.id}`)
    },
    stopAudio(id) {
      let str = `audio${id}`
      this.$refs[str][0].pause()
    }
  }
}
</script>

<style lang="less">
.knowledge-describe {
  &__item {
    display: flex;
    align-items: baseline;
  }
  &__item + &__item {
    margin-top: 15px;
  }
  &__label {
    margin-right: 15px;
    text-align: right;
    white-space: nowrap;
  }
  &__con {
    flex: 1;
  }
  &__txt + &__txt {
    margin-top: 15px;
  }
  &__txt {
    word-break: break-all;
    flex: 1;
    &.has-icon{
      display: flex;
      align-items: baseline;
      & > div {
        flex: 1;
      }
    }
    &.has-icon::before{
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: block;
      background: rgb(53, 135, 255);
      margin-right: 10px;
    }
    img {
      max-width: 200px;
    }
  }
  &__media-name{
    color: rgb(53, 135, 255);
    cursor: pointer;
    outline: none;
  }
  &__audio + &__audio, &__video + &__video {
    margin-top: 10px;
  }
  &__audio-ctr{
    display: block;
  }
}
</style>
