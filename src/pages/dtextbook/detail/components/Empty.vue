<template>
  <div class="tb-empty-page">
    <img src="/static/images/tb-empty.png" alt="">
    <p>{{tip}}</p>
    <div>
      <el-button type="primary" size="small" v-for="(item, index) in btns" :key="index" @click="item.clickHandler">{{item.name}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bg: String,
    tip: {
      type: String,
      default: '暂无素材，请添加题目'
    },
    btns: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less">
.tb-empty-page{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > p {
    color: var(--gray-lighter);
    font-size: 14px;
    margin: 20px 0;
  }
}
</style>
