<template>
  <div class="lecture-detail-item">
    <h4 class="lecture-detail-item__hd text-center">{{data.templateName}}</h4>
    <template v-if="data.leaf">
      <template v-if="data.contextType === 'TEXT' && data.contentText">
        <div class="lecture-detail-item__content" v-html="data.contentText.text"></div>
      </template>
      <template v-if="data.contextType === 'IMAGE' && data.contentImage">
        <div class="lecture-detail-item__content">
          <img :src="data.contentImage.url" alt="">
        </div>
      </template>
      <template v-if="data.contextType === 'ITEM' && data.contentItemInfo">
        <question :data="data.contentItem" :idx="idx"/>
      </template>
    </template>
    <template v-else>
      <pre-item :idx="index+1" :data="item" v-for="(item, index) in data.children" :key="item.id"/>
    </template>
  </div>
</template>

<script>
import Question from '@/components/question/Index'
export default {
  name: 'PreItem',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    idx: Number
  },
  components: {
    Question
  }
}
</script>
<style lang="less">
  .lecture-detail-item {
    .textbook-detail-item__hd
      + .textbook-detail-item
      > .textbook-detail-item__hd {
      text-align: left;
      font-size: 14px;
    }
  }
</style>
