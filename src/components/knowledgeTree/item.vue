<template>
  <span class="tree-node">
    <i class="tree-node__icon"></i>
    <span class="tree-node__label" :title="content">{{content}}</span>
  </span>
</template>

<script>
export default {
  props: {
    content: String
  }
}
</script>

<style lang="less">
.tree-node {
  display: flex;
  overflow: hidden;
  align-items: center;
  &__icon {
    background: url(../../assets/images/node.png) no-repeat center center;
    width: 20px;
    height: 20px;
  }
  &.is-leaf &__icon{
    background-image: url(../../assets/images/file.png)
  }
  &__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
}
</style>
