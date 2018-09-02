<template>
  <section class="m-content-expand" :class="{'is-hover': showBtn}">
    <div class="m-content-expand__btns" v-if="showBtn">
      <slot name="btns"></slot>
    </div>
    <div class="m-content-expand__content">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    showBtn: Boolean
  }
}
</script>

<style lang="less">
.m-content-expand {
  --color: #20a0ff;
  --bg-color: #fff;
  --color-hover: #20a0ff;
  --border-color: transparent;
  --border: 1px solid var(--border-color);
  border: var(--border);
  border-radius: 5px;
  position: relative;
  padding: 20px;
  &__btns {
    position: absolute;
    border-bottom: 0 none;
    top: -26px;
    right: 20px;
    border-radius: 5px 5px 0 0;
    user-select: none;
    border: var(--border);
    display: none;
    overflow: hidden;
  }
  &__btn {
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    white-space: nowrap;
    color: var(--color);
    padding: 0 20px;
    cursor: pointer;
    &:hover {
      background: var(--color-hover);
      --color: #fff;
    }
  }
  &__btn + &__btn {
    border-left: var(--border);
  }
  &__content {
    position: relative;
  }
  &.is-hover:hover {
    --border-color: var(--color-hover);
  }
  &.is-hover:hover &__btns {
    display: inline-flex;
  }
}
</style>
