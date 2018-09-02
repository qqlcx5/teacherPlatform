<template>
  <div class="knowledge-summary" v-html="data" v-mathjax></div>
</template>

<script>
export default {
  props: {
    data: String
  }
}
</script>

<style lang="less">
.knowledge-summary{
  img{
    max-width: 200px;
  }
}
</style>
