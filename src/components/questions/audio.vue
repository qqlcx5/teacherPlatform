<template>
  <div class="m-qu-analy-audio">
    <el-popover placement="right" width="320" trigger="click" @hide="stopAudio">
      <audio controls :src="data.linkUrl" ref="audio" class="m-qu-analy-audio__ctr"></audio>
      <el-button type="text" slot="reference" size="mini"><i class="iconfont icon-yinpin"></i>{{data.audioName}}</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    stopAudio() {
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
    }
  }
}
</script>

<style lang="less">
.m-qu-analy-audio{
  &__ctr{
    display: block;
  }
  .iconfont{
    vertical-align: -2px;
    margin-right: 5px;
  }
}
</style>
