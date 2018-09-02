<template>
  <div class="m-qu-analy-video">
    <el-button type="text" slot="reference" size="mini" @click="play">
      <i class="iconfont icon-shipin"></i>{{data.videoName}}</el-button>
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
    play() {
      window.open(`/#/video/${this.data.id}`)
    }
  }
}
</script>

<style lang="less">
.m-qu-analy-video {
  .iconfont {
    vertical-align: -2px;
    margin-right: 5px;
  }
}
</style>
