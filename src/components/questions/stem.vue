<template>
  <div class="m-qu-stem" v-html="contentHtml"></div>
</template>

<script>
export default {
  props: {
    content: String,
    score: Number,
    idx: [String, Number],
    tag: String,
    hasScore: Boolean,
    hasIdx: Boolean,
    hasTag: Boolean,
    isChild: Boolean
  },
  computed: {
    idxHtml() {
      let bol = this.hasIdx && this.idx
      let str = this.isChild ? `<span class="m-qu-stem__idx is-child" split="${this.idx}"></span>` : `<span class="m-qu-stem__idx" split="${this.idx}."></span>`
      let html = bol ? str : ''
      return html
    },
    tagHtml() {
      let bol = this.hasTag && this.tag
      let str = bol ? `<span class="m-qu-stem__tag">【${this.tag}】</span>` : ''
      return str
    },
    scoreHtml() {
      let bol = this.score && this.hasScore
      let str = bol ? `<span class="m-qu-stem__score">(${this.score}分)</span>` : ''
      return str
    },
    contentHtml() {
      return this.idxHtml + this.scoreHtml + this.tagHtml + this.content
    }
  }
}
</script>

<style lang="less">
.m-qu-stem {
  img {
    max-width: 450px;
  }
  &__idx{
    white-space: nowrap;
    &::after{
      content: attr(split);
      display: inline-block;
    }
    &.is-child{
      margin-right: 10px;
    }
  }
  &__score{
    margin-right: 8px;
    color: #f7ba2a;
  }
}
</style>
