<template>
  <div>
    <v-stem :content="data.content" :tag="data.originTag" :score="data.itemScore" :has-tag="hasTag" :has-score="hasScore" :idx="idx" :has-idx="hasIdx" :is-child="isChild"/>
    <template v-if="data.subItems && data.subItems.length > 0">
      <qu-item 
        class="m-qu-child"
        :data="child" 
        v-for="(child, index) in data.subItems" 
        :key="index" 
        :has-analy="hasAnaly" 
        :has-score="hasScore" 
        :has-idx="true"
        :has-audio="hasAudio"
        :has-video="hasVideo"
        :has-option="hasOption"
        :has-tag="hasTag"
        :has-src-tag="hasSrcTag"
        :is-child="true"
        :idx="child.showNo || `(${index + 1})`"
      />
    </template>
    <template v-else>
      <v-options :data="data.options" v-if="hasOption && (data.itemTypeId === 2 || data.itemTypeId === 3)"/>
      <v-analy :data="analy" :has-audio="hasAudio" :has-video="hasVideo" :has-src-tag="hasSrcTag" v-if="hasAnaly" />
    </template>
  </div>
</template>

<script>
import vStem from './stem'
import vOptions from './options'
import vAnaly from './analy'
export default {
  name: 'qu-item',
  components: {
    vStem,
    vOptions,
    vAnaly
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    idx: [String, Number],
    hasAnaly: Boolean,
    hasScore: Boolean,
    hasIdx: Boolean,
    hasAudio: Boolean,
    hasVideo: Boolean,
    hasOption: Boolean,
    hasTag: Boolean,
    hasSrcTag: Boolean,
    isChild: Boolean
  },
  inject: ['originTagList'],
  computed: {
    analy() {
      const originTagList = this.originTagList.data.originTagList || []
      const { diffLevelValue, points, answer, detail, videos, audios } = this.data
      return { diffLevelValue, points, answer, detail, videos, audios, originTagList }
    }
  }
}
</script>

<style lang="less">
.m-qu-child{
  margin-top: 20px;
}
</style>
