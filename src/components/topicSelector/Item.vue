<template>
  <dl class="topic-selector__item">
    <dt class="topic-selector__label" :style="{width: width}">{{data.label}}：</dt>
    <dd :ref="itemName" class="topic-selector__con" :class="{'is-collapse': isCollapse}" v-if="data.list && data.list.length > 0">
      <span class="topic-selector__key" :class="{'is-active': sub.code === selectedResult}" v-for="sub in data.list" :key="sub.code" @click="onSelect(data.key, sub.code)">{{sub.label}}</span>
    </dd>
    <dd class="topic-selector__extend">
      <span class="topic-selector__more" @click="open()" v-if="hasOpenBtn">更多
        <i :class="[isCollapse?'el-icon-arrow-down':'el-icon-arrow-up']"></i>
      </span>
    </dd>
  </dl>
</template>

<script>
import random from 'lodash/random'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: String
  },
  data() {
    return {
      isCollapse: false,
      hasOpenBtn: false,
      selectedResult: '',
      itemName: random(100)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    initData() {
      let el = this.$refs[this.itemName]
      if (el && el.clientHeight > 50) {
        this.hasOpenBtn = true
        this.isCollapse = true
      }
    },
    open() {
      this.isCollapse = !this.isCollapse
    },
    onSelect(key, code) {
      this.selectedResult = code
      this.$emit('change', { key, code })
    }
  }
}
</script>
