<template>
  <section class="tb-detail-side">
    <div class="tb-detail-side__hd">
      <i class="iconfont icon-jiaocai"></i>教研大纲</div>
    <v-catalog v-bind="$attrs" v-on="$listeners" class="tb-detail-side__bd" />
  </section>
</template>
<script>
import vCatalog from './Catalog'
export default {
  components: {
    vCatalog
  },
  inheritAttrs: false,
  watch: {
    '$attr'(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="less">
.tb-detail-side {
  background: #fff;
  border: var(--border);
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  &__hd {
    line-height: 1;
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    i {
      font-weight: normal;
      color: #bcbcbc;
      margin-right: 8px;
    }
  }
}
</style>
