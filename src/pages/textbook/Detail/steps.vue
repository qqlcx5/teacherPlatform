<template>
  <ul class="m-steps">
    <li class="m-steps__item" :class="{'is-active': activeIndex === index}" v-for="(item, index) in data" :key="index" @click="jump(index)">
      <div class="m-steps__hd"><span class="m-steps__line"></span><i class="m-steps__icon"></i></div>
      <div class="m-steps__bd">
        <div class="m-steps__title">{{item.templateName}}</div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeIndex: 0
    }
  },
  watch: {
    active(val) {
      this.activeIndex = val
    }
  },
  methods: {
    jump(index) {
      this.activeIndex = index
      this.$emit('jump', this.activeIndex)
    }
  }
}
</script>

<style lang="less">
@import url('../../../assets/less/variables.less');
.m-steps{
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  &__item{
    list-style: none;
    display: flex;
    flex-basis: 40px;
    cursor: pointer;
  }
  &__hd{
    position: relative;
    width: 24px;
  }
  &__icon{
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #add6ff;
    position: relative;
    display: block;
  }
  &__line{
    position: absolute;
    height: 100%;
    border-left: 1px solid #add6ff;
    left: 6px;
    top: 0;
  }
  &__item:last-of-type &__line{
    display: none;
  }
  &__bd{
    position: relative;
    top:1px;
    color: #b9b9b9;
    line-height: 1;
    padding: 0 0 10px 10px
  }
  &__item.is-active &__icon{
    background-color: @blue
  }
  &__item.is-active &__bd{
    color: @blue
  }
 }
 </style>