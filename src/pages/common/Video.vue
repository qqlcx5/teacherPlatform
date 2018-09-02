<template>
  <div class="item-video-panel">
    <video class="video-player" controls autoplay>
      <source v-if="videoUrl" :src="videoUrl">
    </video>
  </div>
</template>
<script>
import videoApi from '@/api/video'
export default {
  name: 'ItemVideo',
  mounted () {
    this.getVideoUrl()
  },
  data () {
    return {
      videoUrl: '',
      ratio: 4,
      errorTip: ''
    }
  },
  methods: {
    getVideoUrl () {
      videoApi.getVideoUrl({videoId: this.$route.params.videoId, ratio: this.ratio}).then(res => {
        this.videoUrl = res.data
      }).catch(err => {
        if (err === '获取播放地址失败：视频转码中，请稍后再播放！') {
          this.$message.error('获取播放地址失败：视频转码中，请稍后再播放！')
          // this.$alert(err, '提示', {
          //   type: 'error',
          //   customClass: 'video-transfering-tip',
          //   showCancelButton: false,
          //   showConfirmButton: false,
          //   closeOnClickModal: false,
          //   closeOnPressEscape: false
          // })
          return false
        }
        this.errorTip = err.message
        this.$message.error(err.message)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.item-video-panel{
  .video-player{
    background-color: #000;
    width: 100%;
    height: calc(~"100vh - 100px")
  }
}
</style>
