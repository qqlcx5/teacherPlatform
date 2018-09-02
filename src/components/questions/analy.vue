<template>
  <ul class="m-qu-analy">
    <li class="m-qu-analy__item">
      <div class="m-qu-analy__label">难度：</div>
      <div class="m-qu-analy__con">
        <el-rate :value="data.diffLevelValue" disabled>
        </el-rate>
      </div>
    </li>
    <li class="m-qu-analy__item">
      <div class="m-qu-analy__label">考点：</div>
      <div class="m-qu-analy__con">{{points}}</div>
    </li>
    <li class="m-qu-analy__item">
      <div class="m-qu-analy__label">答案：</div>
      <div class="m-qu-analy__con" v-html="data.answer"></div>
    </li>
    <li class="m-qu-analy__item">
      <div class="m-qu-analy__label">解析：</div>
      <div class="m-qu-analy__con" v-html="data.detail"></div>
    </li>
    <li class="m-qu-analy__item" v-if="hasAudio">
      <div class="m-qu-analy__label">音频：</div>
      <div class="m-qu-analy__con">
        <v-audio :data="item" v-for="(item, index) in data.audios" :key="index" />
      </div>
    </li>
    <li class="m-qu-analy__item" v-if="hasVideo">
      <div class="m-qu-analy__label">视频：</div>
      <div class="m-qu-analy__con">
        <v-video :data="item" v-for="(item, index) in data.videos" :key="index" />
      </div>
    </li>
    <li class="m-qu-analy__item" v-if="hasSrcTag">
      <div class="m-qu-analy__label">来源：</div>
      <div class="m-qu-analy__con">
        <v-tag :data="data.originTagList"/>
      </div>
    </li>
  </ul>
</template>

<script>
import vAudio from './audio'
import vVideo from './video'
import vTag from './tag'
export default {
  components: {
    vAudio,
    vVideo,
    vTag
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hasVideo: Boolean,
    hasAudio: Boolean,
    hasSrcTag: Boolean
  },
  computed: {
    points() {
      let items = this.data.points
      if (items) {
        const toString = Object.prototype.toString
        if (toString.call(items) === '[object Array]') {
          return items.map(item => item.nodeName).join(',')
        }
      }
      return items || ''
    }
  }
}
</script>

<style lang="less">
.m-qu-analy {
  padding: 20px;
  margin: 20px 0 0 0;
  background: var(--bg-color);
  &__label{
    white-space: nowrap;
  }
  &__item {
    display: flex;
    align-items: baseline;
    list-style: none;
    & + & {
      margin-top: 20px;
    }
  }
  &__con {
    flex: 1;
    margin-left: 15px;
    img{
      max-width: 450px;
    }
  }
}
</style>
