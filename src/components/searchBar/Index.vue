<template>
  <el-input @keyup.enter.native="search" :value="value" :style="{width: width}" :size="size" :placeholder="placeholderText" class="hi" @change="change">
    <el-button :size="size" class="btn" slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small'
    },
    width: {
      type: String,
      default: '248px'
    },
    placeholderText: String,
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    search() {
      this.$emit('search', this.value.trim())
    },
    change(val) {
      this.$emit('input', val.trim())
    }
  }
}
</script>

<style lang="less">
@import url(../../assets/less/variables.less);
.hi .el-input-group__append {
  border: 2px solid @blue;
  background-color: @blue;
  color: #fff;
}
</style>
