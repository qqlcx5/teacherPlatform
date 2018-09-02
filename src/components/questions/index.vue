<template>
  <div class="m-qu" :class="{'is-hover': canOpera}" v-mathjax>
    <div class="m-qu-btns" v-if="canOpera">
      <slot name="btns" :item="data"></slot>
    </div>
    <v-item :data="data" :has-analy="hasAnaly" :has-score="hasScore" :has-idx="hasIdx" :has-audio="hasAudio" :has-video="hasVideo" :has-option="hasOption" :has-tag="hasTag" :has-src-tag="hasSrcTag" :can-opera="canOpera" :idx="idx" :origin-list="data.originList" />
  </div>
</template>

<script>
import vTag from './tag'
import vItem from './item'
export default {
  components: {
    vTag,
    vItem
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hasAnaly: Boolean,
    hasTag: {
      type: Boolean,
      default: true
    },
    hasSrcTag: {
      type: Boolean,
      default: true
    },
    hasOption: {
      type: Boolean,
      default: true
    },
    hasScore: Boolean,
    hasIdx: Boolean,
    hasAudio: {
      type: Boolean,
      default: true
    },
    hasVideo: {
      type: Boolean,
      default: true
    },
    canOpera: {
      type: Boolean,
      default: true
    },
    idx: [String, Number]
  },
  provide() {
    return {
      originTagList: this
    }
  }
}
</script>

<style lang="less">
.m-qu {
  --bg-color: rgb(248, 248, 248);
  --text-color-hover: transparent;
  --border-color: var(--text-color-hover);
  --border: 1px solid var(--border-color);
  padding: 20px;
  position: relative;
  border: var(--border);
  font-size: 12px;
  border-radius: 5px;
  &.is-hover:hover {
    --text-color-hover: #20a0ff;
  }
  &.is-hover:hover &-btns {
    display: inline-flex;
  }
  &-btns {
    position: absolute;
    border-bottom: 0 none;
    top: -26px;
    right: 20px;
    border-radius: 5px 5px 0 0;
    display: none;
    -webkit-user-select: none;
    border: var(--border);
    &__itm {
      font-size: 12px;
      line-height: 24px;
      height: 24px;
      white-space: nowrap;
      color: var(--text-color-hover);
      padding: 0 20px;
      cursor: pointer;
      &:hover {
        background: var(--text-color-hover);
        color: #fff;
      }
    }
    &__itm + &__itm {
      border-left: var(--border);
    }
  }
}
</style>
