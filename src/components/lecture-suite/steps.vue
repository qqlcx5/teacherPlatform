<template>
  <div class="lecture-suite-steps">
    <span class="lecture-suite-steps__item" v-for="item in data" :key="item.code" @click="select(item.code)">+{{item.label}}</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    select: {
      type: Function
    }
  }
}
</script>

<style lang="less">
.lecture-suite-steps {
  display: flex;
  justify-content: space-between;
  line-height: 56px;
  height: 56px;
  border: 1px dashed #3587ff;
  padding: 0 50px;
  &__item {
    color: #3587ff;
    cursor: pointer;
  }
}
</style>
