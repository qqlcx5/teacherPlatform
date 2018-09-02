<template>
  <div class="knowledge-suite-item">
    <div class="knowledge-suite-item__left">
      {{data.teachingStepsName}}
      <span class="knowledge-suite-item__name" v-show="data.bindStatus === 'UNBOUND'">(未绑定)</span>
      <span v-show="data.bindStatus === 'BIND'">：{{title}}</span>
    </div>
    <div class="knowledge-suite-item__right">
      <slot name="operate"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    title() {
      let types = {
        LECTURE: '讲义',
        PAPER: '试卷'
      }
      let str = types[this.data.refType]
      if (str) {
        return `【${str}】` + this.data.templateName
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less">
.knowledge-suite-item {
  background-color: #eff7ff;
  height: 56px;
  line-height: 56px;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  margin-top: 20px;
  &__name {
    color: #bfc3ca;
    margin-left: 10px;
  }
  &__operate {
    text-align: right;
    & > span {
      color: #3587ff;
      cursor: pointer;
      &.is-delete {
        color: #fe5c5d;
      }
    }
    & > span + span {
      margin-left: 15px;
    }
    & > span > i {
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
</style>
